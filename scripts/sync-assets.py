import json,io,hashlib,re,time,base64
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor,as_completed
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SOURCES=json.loads((ROOT/'data/image-sources.json').read_text())
def download(entry):
 errors=[]
 for url in entry['urls']:
  try:
   req=Request(url,headers={'User-Agent':'Mozilla/5.0','Accept':'image/avif,image/webp,image/png,image/*;q=0.8'})
   with urlopen(req,timeout=15) as response:
    raw=response.read(5*1024*1024+1)
   if len(raw)>5*1024*1024:raise ValueError('image exceeds 5MB')
   with Image.open(io.BytesIO(raw)) as im:
    im.load();original=im.size;im=im.convert('RGBA');im.thumbnail((64,64) if entry['type']=='elements' else (192,192),Image.Resampling.LANCZOS)
    stem=Path(urlparse(entry['urls'][0]).path).stem
    stem=re.sub(r'[^a-zA-Z0-9_-]','-',stem)
    path=Path('assets')/entry['type']/(stem+'.svg')
    f=ROOT/path;f.parent.mkdir(parents=True,exist_ok=True)
    buffer=io.BytesIO();im.save(buffer,'WEBP',quality=85,method=6)
    encoded_bytes=buffer.getvalue();encoded=base64.b64encode(encoded_bytes).decode();w,h=im.size
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><image width="{w}" height="{h}" href="data:image/webp;base64,{encoded}"/></svg>\n'
    f.write_text(svg)
    return {**entry,'path':str(path),'source':url,'originalSize':original,'size':im.size,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'embeddedWebpBytes':len(encoded_bytes),'embeddedWebpSha256':hashlib.sha256(encoded_bytes).hexdigest(),'encoding':'SVG image containing a self-contained WebP raster; no external references'}
  except Exception as e:errors.append({'url':url,'error':str(e)})
 return {**entry,'errors':errors}
results=[]
with ThreadPoolExecutor(max_workers=8) as pool:
 futures=[pool.submit(download,e) for e in SOURCES]
 for future in as_completed(futures):
  r=future.result();results.append(r)
  if 'path' not in r:print('MISSING',r['name'],json.dumps(r['errors'],ensure_ascii=False),flush=True)
  elif len(results)%20==0: print('Downloaded',len(results),'/',len(SOURCES),flush=True)
missing=[r['name'] for r in results if 'path' not in r]
if missing:
 print('Incomplete download; existing manifest and path mapping retained:', ', '.join(missing),flush=True)
 raise SystemExit(1)
manifest={'generatedAt':datetime.now(timezone.utc).date().isoformat(),'note':'Non-official fan simulator. Game images and character designs belong to their respective rights holders. Source URLs record provenance, not a grant of license. Images resized and encoded to WebP for this site.','assets':sorted(results,key=lambda x:(x['type'],x['name']))}
(ROOT/'assets').mkdir(exist_ok=True)
(ROOT/'assets/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'downloaded':sum('path'in r for r in results),'missing':[r['name']for r in results if 'path'not in r],'totalBytes':sum(r.get('bytes',0)for r in results)},ensure_ascii=False),flush=True)

items={r['name']:['./'+r['path']] for r in manifest['assets'] if r['type']!='elements'}
elements={r['name']:['./'+r['path']] for r in manifest['assets'] if r['type']=='elements'}
(ROOT/'data/images.js').write_text('// Site-hosted optimized images. Source URLs and hashes: assets/manifest.json.\nvar ITEM_IMAGES = '+json.dumps(items,ensure_ascii=False,indent=2)+';\nvar ELEMENT_IMAGES = '+json.dumps(elements,ensure_ascii=False,indent=2)+';\n')
