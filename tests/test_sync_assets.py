import importlib.util
import io
import json
import tempfile
import unittest
from pathlib import Path
from PIL import Image

spec = importlib.util.spec_from_file_location('sync_assets', Path(__file__).resolve().parents[1] / 'scripts/sync-assets.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def picture(color='red'):
    buffer = io.BytesIO()
    Image.new('RGBA', (300, 250), color).save(buffer, 'PNG')
    return buffer.getvalue()


def entry(name='测试角色', file='avatar.png'):
    return {'name': name, 'type': 'characters', 'urls': ['https://images.example/' + file]}


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'data').mkdir()
        (self.root / 'index.html').write_text('<script src="./data/images.js?v=old"></script>')
        self.sources([entry()])

    def sources(self, entries):
        (self.root / 'data/image-sources.json').write_text(json.dumps(entries))

    def snapshot(self):
        return {str(p.relative_to(self.root)): p.read_bytes() for p in self.root.rglob('*') if p.is_file()}

    def test_second_run_is_noop_and_uses_no_network(self):
        result = module.sync(self.root, fetch=lambda url: picture())
        self.assertEqual(result['downloaded'], 1)
        before = self.snapshot()
        result = module.sync(self.root, fetch=lambda url: self.fail('unexpected fetch'))
        self.assertEqual(result['changedFiles'], 0)
        self.assertEqual(before, self.snapshot())
        self.assertNotIn('?v=old', (self.root / 'index.html').read_text())

    def test_failed_batch_preserves_existing_assets(self):
        module.sync(self.root, fetch=lambda url: picture())
        self.sources([entry(), entry('新角色', 'new.png')])
        before = self.snapshot()
        def fetch(url):
            if 'new.png' in url:
                raise OSError('missing')
            return picture('blue')
        with self.assertRaisesRegex(RuntimeError, 'no files changed'):
            module.sync(self.root, refresh=True, fetch=fetch)
        self.assertEqual(before, self.snapshot())

    def test_failed_first_batch_creates_no_partial_assets(self):
        self.sources([entry(), entry('新角色', 'new.png')])
        before = self.snapshot()
        def fetch(url):
            if 'new.png' in url:
                raise OSError('missing')
            return picture()
        with self.assertRaises(RuntimeError):
            module.sync(self.root, fetch=fetch)
        self.assertEqual(before, self.snapshot())

    def test_changed_source_downloads_only_that_image(self):
        self.sources([entry(), entry('其他角色', 'other.png')])
        module.sync(self.root, fetch=lambda url: picture())
        changed = entry()
        changed['urls'].append('https://backup.example/avatar.png')
        self.sources([changed, entry('其他角色', 'other.png')])
        calls = []
        result = module.sync(self.root, fetch=lambda url: calls.append(url) or picture('blue'))
        self.assertEqual(result['downloaded'], 1)
        self.assertEqual(calls, ['https://images.example/avatar.png'])

    def test_corrupted_cache_is_repaired(self):
        module.sync(self.root, fetch=lambda url: picture())
        image = self.root / 'assets/characters/avatar.svg'
        image.write_text('corrupted')
        result = module.sync(self.root, fetch=lambda url: picture())
        self.assertEqual(result['downloaded'], 1)
        self.assertTrue(image.read_text().startswith('<svg'))

    def test_fallback_source_and_forced_refresh(self):
        item = entry()
        item['urls'].append('https://backup.example/avatar.png')
        self.sources([item])
        calls = []
        def fetch(url):
            calls.append(url)
            if 'images.example' in url:
                raise OSError('unavailable')
            return picture()
        module.sync(self.root, fetch=fetch)
        result = module.sync(self.root, refresh=True, fetch=fetch)
        self.assertEqual(result['downloaded'], 1)
        self.assertEqual(len(calls), 4)

    def test_check_mode_writes_nothing(self):
        before = self.snapshot()
        result = module.sync(self.root, check=True, fetch=lambda url: picture())
        self.assertGreater(result['changedFiles'], 0)
        self.assertEqual(before, self.snapshot())

    def test_source_removal_preserves_unmanaged_files(self):
        self.sources([entry(), entry('其他角色', 'other.png')])
        module.sync(self.root, fetch=lambda url: picture())
        custom = self.root / 'assets/characters/custom.svg'
        custom.write_text('user asset')
        self.sources([entry()])
        module.sync(self.root, fetch=lambda url: self.fail('unexpected fetch'))
        self.assertFalse((self.root / 'assets/characters/other.svg').exists())
        self.assertTrue(custom.exists())

    def test_duplicate_path_rejected_before_network(self):
        self.sources([entry(), entry('另一个名字')])
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            module.sync(self.root, fetch=lambda url: self.fail('unexpected fetch'))


if __name__ == '__main__':
    unittest.main()
