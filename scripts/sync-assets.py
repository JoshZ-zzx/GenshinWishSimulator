"""Maintain self-contained site images; download everything before changing files."""
import argparse
import base64
import hashlib
import io
import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
KINDS = {'characters', 'weapons', 'elements'}
NOTE = ('Non-official fan simulator. Game images and character designs belong to their '
        'respective rights holders. Source URLs record provenance, not a grant of license. '
        'Images resized and encoded to WebP for this site.')


def digest(data):
    return hashlib.sha256(data).hexdigest()


def asset_path(entry):
    stem = re.sub(r'[^a-zA-Z0-9_-]', '-', Path(urlparse(entry['urls'][0]).path).stem)
    if not stem:
        raise ValueError('Image URL must include a file name: ' + entry['name'])
    return Path('assets') / entry['type'] / (stem + '.svg')


def fetch_image(url):
    last = None
    for attempt in range(2):
        try:
            request = Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'image/webp,image/png,image/*;q=0.8'})
            with urlopen(request, timeout=20) as response:
                raw = response.read(5 * 1024 * 1024 + 1)
            if len(raw) > 5 * 1024 * 1024:
                raise ValueError('Image exceeds 5 MB')
            return raw
        except Exception as error:
            last = error
            if attempt == 0:
                time.sleep(1)
    raise last


def download(entry, fetch):
    errors = []
    for url in entry['urls']:
        try:
            with Image.open(io.BytesIO(fetch(url))) as image:
                image.load()
                original = list(image.size)
                image = image.convert('RGBA')
                image.thumbnail((64, 64) if entry['type'] == 'elements' else (192, 192), Image.Resampling.LANCZOS)
                buffer = io.BytesIO()
                image.save(buffer, 'WEBP', quality=85, method=6)
                encoded_bytes = buffer.getvalue()
                encoded = base64.b64encode(encoded_bytes).decode()
                width, height = image.size
                svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
                       f'viewBox="0 0 {width} {height}"><image width="{width}" height="{height}" '
                       f'href="data:image/webp;base64,{encoded}"/></svg>\n').encode()
                record = {**entry, 'path': str(asset_path(entry)), 'source': url,
                          'originalSize': original, 'size': list(image.size), 'bytes': len(svg),
                          'sha256': digest(svg), 'embeddedWebpBytes': len(encoded_bytes),
                          'embeddedWebpSha256': digest(encoded_bytes),
                          'encoding': 'SVG image containing a self-contained WebP raster; no external references'}
                return record, svg
        except Exception as error:
            errors.append(f'{url}: {error}')
    raise RuntimeError(entry['name'] + ': ' + '; '.join(errors))


def json_text(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'


def sync(root=ROOT, refresh=False, fetch=fetch_image, check=False):
    root = Path(root)
    sources = json.loads((root / 'data/image-sources.json').read_text())
    if not isinstance(sources, list) or not sources:
        raise ValueError('Image source list must be a non-empty array')
    names, paths = set(), set()
    for entry in sources:
        if (not isinstance(entry, dict) or not isinstance(entry.get('name'), str)
                or not entry['name'].strip() or entry.get('type') not in KINDS
                or not isinstance(entry.get('urls'), list) or not entry['urls']):
            raise ValueError('Each image needs a name, a valid type and a list of URLs')
        for url in entry['urls']:
            parsed = urlparse(url)
            if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
                raise ValueError('Use public HTTPS image URLs: ' + entry['name'])
        key = (entry['type'], entry['name'])
        path = str(asset_path(entry))
        if key in names or path in paths:
            raise ValueError('Duplicate image name or destination: ' + entry['name'])
        names.add(key)
        paths.add(path)

    manifest_path = root / 'assets/manifest.json'
    old = json.loads(manifest_path.read_text()) if manifest_path.exists() else {'assets': []}
    previous = {(item['type'], item['name']): item for item in old['assets']}
    records, pending, payloads = [], [], {}
    for entry in sources:
        cached = previous.get((entry['type'], entry['name']))
        path = asset_path(entry)
        if (not refresh and cached and cached.get('urls') == entry['urls']
                and cached.get('path') == str(path) and (root / path).is_file()
                and digest((root / path).read_bytes()) == cached.get('sha256')):
            records.append(cached)
        else:
            pending.append(entry)
    failures = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(download, entry, fetch): entry for entry in pending}
        for future in as_completed(futures):
            try:
                record, data = future.result()
                records.append(record)
                payloads[record['path']] = data
                print('Downloaded:', record['name'], flush=True)
            except Exception as error:
                failures.append(str(error))
    if failures:
        raise RuntimeError('Download failed; no files changed.\n' + '\n'.join(failures))

    records.sort(key=lambda item: (item['type'], item['name']))
    manifest = {'generatedAt': old.get('generatedAt') if records == old['assets'] else datetime.now(timezone.utc).date().isoformat(),
                'note': old.get('note', NOTE), 'assets': records}
    items = {item['name']: ['./' + item['path'] + '?v=' + item['sha256'][:12]]
             for item in records if item['type'] != 'elements'}
    elements = {item['name']: ['./' + item['path'] + '?v=' + item['sha256'][:12]]
                for item in records if item['type'] == 'elements'}
    mapping = ('// Site-hosted optimized images. Source URLs and hashes: assets/manifest.json.\n'
               'var ITEM_IMAGES = ' + json.dumps(items, ensure_ascii=False, indent=2) + ';\n'
               'var ELEMENT_IMAGES = ' + json.dumps(elements, ensure_ascii=False, indent=2) + ';\n')
    payloads['assets/manifest.json'] = json_text(manifest).encode()
    payloads['data/images.js'] = mapping.encode()
    index = root / 'index.html'
    if index.exists():
        version = digest(mapping.encode())[:12]
        html, count = re.subn(r'(src=[\"\']\./data/images\.js)(?:\?[^\"\']*)?([\"\'])',
                              lambda match: match[1] + '?v=' + version + match[2], index.read_text())
        if count != 1:
            raise ValueError('Expected one image mapping script in index.html')
        payloads['index.html'] = html.encode()
    obsolete = {item['path'] for item in old['assets']} - paths
    for path in obsolete:
        if not re.fullmatch(r'assets/(characters|weapons|elements)/[a-zA-Z0-9_-]+\.svg', path):
            raise ValueError('Unexpected stale asset path: ' + path)
    changes = {path: data for path, data in payloads.items()
               if not (root / path).exists() or (root / path).read_bytes() != data}
    if not check:
        for path, data in changes.items():
            target = root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        for path in obsolete:
            (root / path).unlink(missing_ok=True)
    return {'total': len(records), 'downloaded': len(pending), 'reused': len(sources) - len(pending),
            'changedFiles': len(changes) + len(obsolete), 'checkedOnly': check}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh', action='store_true', help='Re-download existing images as well')
    parser.add_argument('--check', action='store_true', help='Validate and report without writing files')
    args = parser.parse_args()
    try:
        result = sync(refresh=args.refresh, check=args.check)
        print(json.dumps(result, ensure_ascii=False))
        summary = os.environ.get('GITHUB_STEP_SUMMARY')
        if summary:
            with open(summary, 'a') as stream:
                stream.write(f"## 图片更新\n\n总计 {result['total']} 张，复用 {result['reused']} 张，下载 {result['downloaded']} 张，变更 {result['changedFiles']} 个文件。\n")
    except Exception as error:
        print(str(error), flush=True)
        raise SystemExit(1)


if __name__ == '__main__':
    main()
