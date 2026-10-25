#!/usr/bin/env python3
"""Refresh the official component index and vendored Radix/Nova sources.

Run explicitly with npm run sync:components. No scraping or remote code fetch
happens in the visitor's browser. Review the source diff after refreshing.
"""
import concurrent.futures
import datetime
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = 'https://ui.shadcn.com/docs/components'
REGISTRY = 'https://ui.shadcn.com/r/styles/radix-nova/'

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'AplusStudio-ComponentSync/1.0'}), timeout=45) as response:
        return response.read().decode('utf-8')

def registry(name):
    return name, json.loads(fetch(REGISTRY + name + '.json'))

def main():
    cache = ROOT / 'vendor/shadcn/registry'
    recipes = {'data-table': ['table'], 'date-picker': ['calendar', 'popover'], 'typography': [], 'toast': ['sonner']}
    if '--offline' in sys.argv:
        slugs = [item['id'] for item in json.loads((ROOT / 'src/data/shadcn-catalog.json').read_text())]
        downloaded = {path.stem: json.loads(path.read_text()) for path in cache.glob('*.json')}
    else:
        html = fetch(DOCS)
        paths = list(dict.fromkeys(re.findall(r'href="(/docs/components/(?:base/|radix/)?[a-z-]+)"', html)))
        slugs = list(dict.fromkeys(path.rsplit('/', 1)[-1] for path in paths))
        if len(slugs) < 50 or 'button' not in slugs:
            raise RuntimeError('Unexpected official component index; refusing to replace the catalog.')
        names = set(slugs) - set(recipes)
        names.update(['sonner', 'utils'])
        downloaded = {}
        while names:
            with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
                for name, item in pool.map(registry, sorted(names)):
                    downloaded[name] = item
            names = {dep.rsplit('/', 1)[-1].removesuffix('.json') for item in downloaded.values() for dep in item.get('registryDependencies', []) if isinstance(dep, str)} - downloaded.keys()
        cache.mkdir(parents=True, exist_ok=True)
    previous = json.loads((ROOT / 'vendor/shadcn/manifest.json').read_text()) if (ROOT / 'vendor/shadcn/manifest.json').exists() else {}
    retrieved_at = previous.get('retrievedAt') if '--offline' in sys.argv else None
    file_manifest = []
    for name, item in sorted(downloaded.items()):
        (cache / (name + '.json')).write_text(json.dumps(item, ensure_ascii=False, indent=2) + '\n')
        for file in item.get('files', []):
            source = file.get('content', '')
            original = file['path']
            if '/ui/' in original:
                dest = ROOT / 'src/components/lab-ui' / Path(original).name
            elif '/hooks/' in original:
                dest = ROOT / 'src/hooks' / Path(original).name
            elif '/lib/' in original:
                dest = ROOT / ('src/lib/shadcn-utils.ts' if Path(original).name == 'utils.ts' else 'src/lib/shadcn/' + Path(original).name)
            else:
                raise RuntimeError('Review new registry file target: ' + original)
            source = re.sub(r'@/(?:registry/[^\"]+/ui|components/ui)/', '@/components/lab-ui/', source)
            source = re.sub(r'@/(?:registry/[^\"]+/hooks)/', '@/hooks/', source)
            source = source.replace('from "cn"', 'from "@/lib/shadcn-utils"').replace('"@/lib/utils"', '"@/lib/shadcn-utils"')
            source = re.sub(r'@/registry/[^\"]+/lib/', '@/lib/shadcn/', source)
            if dest.name == 'shadcn-utils.ts':
                source = 'import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\nexport function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }\n'
            icons = set()
            def replace_icon(match):
                attrs = match.group(1)
                icon = re.search(r'lucide="([A-Za-z0-9]+)"', attrs).group(1)
                icons.add(icon)
                attrs = re.sub(r'\s*(?:lucide|tabler|hugeicons|phosphor|remixicon)="[^\"]*"', '', attrs)
                return '<' + icon + attrs + '/>'
            source = re.sub(r'<IconPlaceholder\b([^>]*?)/>', replace_icon, source, flags=re.S)
            source = re.sub(r'import \{ IconPlaceholder \} from "[^\"]+"\n', '', source)
            if icons:
                source = 'import { ' + ', '.join(sorted(icons)) + ' } from "lucide-react"\n' + source
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text('// Adapted from shadcn/ui (MIT). See vendor/shadcn/LICENSE.md.\n' + source)
            file_manifest.append({'registryItem': name, 'upstreamPath': original, 'localPath': str(dest.relative_to(ROOT))})
    catalog = [{'id': slug, 'name': {'input-otp': 'Input OTP', 'kbd': 'Kbd'}.get(slug, slug.replace('-', ' ').title()), 'docs': DOCS + '/radix/' + slug, 'registryItems': recipes.get(slug, [slug])} for slug in slugs]
    (ROOT / 'src/data/shadcn-catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'vendor/shadcn/manifest.json').write_text(json.dumps({'source': DOCS, 'registry': REGISTRY, 'style': 'radix-nova', 'retrievedAt': retrieved_at or datetime.datetime.now(datetime.timezone.utc).isoformat(), 'supportStyles': {'package': 'shadcn', 'version': '4.22.1', 'file': 'dist/tailwind.css', 'localPath': 'src/styles/shadcn-variants.css'}, 'components': len(catalog), 'files': file_manifest}, ensure_ascii=False, indent=2) + '\n')
    print(f'Synced {len(catalog)} documented components, {len(downloaded)} registry items, {len(file_manifest)} source files.')
    print('Review dependencies:', sorted({dep for item in downloaded.values() for dep in item.get('dependencies', [])}))

if __name__ == '__main__':
    main()
