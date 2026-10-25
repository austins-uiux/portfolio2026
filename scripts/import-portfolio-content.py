#!/usr/bin/env python3
"""Rebuild portfolio JSON from the retained HTML and asset manifest (requires lxml).

Reads only cached source; does not scrape on builds or page visits.
"""
from pathlib import Path
import json
import re
from urllib.parse import quote, urljoin
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'vendor/portfolio-legacy'


def compact(text):
    return re.sub(r'\s+', ' ', text or '').strip()


def inline(element):
    result = []

    def add(text, strong=False):
        if text:
            item = {'text': re.sub(r'\s+', ' ', text)}
            if strong:
                item['strong'] = True
            result.append(item)

    def walk(node, strong=False):
        add(node.text, strong)
        for child in node:
            if child.tag == 'br':
                result.append({'text': '\n'})
            else:
                walk(child, strong or child.tag in ('strong', 'b'))
            add(child.tail, strong)

    walk(element)
    for i, item in enumerate(result):
        if item['text'] == '\n':
            continue
        if i == 0 or result[i - 1]['text'].endswith('\n'):
            item['text'] = item['text'].lstrip()
        if i == len(result) - 1 or result[i + 1]['text'].startswith('\n'):
            item['text'] = item['text'].rstrip()
    while result and not result[0]['text'].strip():
        result.pop(0)
    while result and not result[-1]['text'].strip():
        result.pop()
    return [item for item in result if item['text']]


def plain(parts):
    return ''.join(item['text'] for item in parts)


def main():
    manifest = json.loads((SOURCE / 'manifest.json').read_text())
    assets = {a['sourceUrl']: a for a in manifest['assets']}
    pages = manifest['pages']
    index = html.fromstring((SOURCE / 'index.html').read_bytes())
    project_cards = index.xpath('//*[@id="projects"]//a[contains(@class,"card")]')
    thinking_cards = index.xpath('//*[@id="thinking"]//a[contains(@class,"card")]')
    assert len(project_cards) == 4 and len(thinking_cards) == 6
    entries = []

    def image(img, page_url, context):
        absolute = urljoin(page_url, quote(img.get('src')))
        asset = assets[absolute]
        return {k: v for k, v in {'src': asset['localPath'], 'alt': context, 'width': asset['width'], 'height': asset['height']}.items()}

    for number, page in enumerate(pages):
        tree = html.fromstring((SOURCE / 'pages' / (page['id'] + '.html')).read_bytes())
        project = number < 4
        card = (project_cards if project else thinking_cards)[number if project else number - 4]
        title = compact(card.xpath('.//h3')[0].text_content())
        entry = {
            'id': page['id'], 'category': 'featured' if project else 'thinking',
            'kind': 'project' if project else 'article', 'title': title,
            'meta': compact(card.xpath('.//span')[0].text_content()),
            'detailTitle': compact(' '.join(tree.xpath('//main//h1')[0].itertext())),
            'thumbnail': image(card.xpath('.//img')[0], manifest['source'], title + ' 썸네일'),
            'sections': [],
        }
        if project:
            entry['summary'] = plain(inline(tree.xpath('//*[contains(@class,"project-description")]')[0]))
            entry['facts'] = [{'label': compact(row.xpath('./span')[0].text_content()), 'value': compact(row.xpath('./p')[0].text_content())} for row in tree.xpath('//*[contains(@class,"project-info")]/div')]
            content = tree.xpath('//*[contains(@class,"project-content")]')[0]
            for block in content:
                imgs = block.xpath('.//img')
                if imgs:
                    entry['sections'].append({'heading': '', 'body': '', 'image': image(imgs[0], page['url'], title + ' 프로젝트 이미지 ' + str(len(entry['sections']) + 1))})
                elif block.xpath('./p'):
                    paragraphs = [inline(p) for p in block.xpath('./p')]
                    headings = block.xpath('./h2')
                    section = {'heading': compact(headings[0].text_content()) if headings else '', 'body': '\n\n'.join(plain(p) for p in paragraphs), 'paragraphs': paragraphs}
                    if entry['sections'] and not entry['sections'][-1]['heading'] and not entry['sections'][-1]['body']:
                        entry['sections'][-1].update(section)
                    else:
                        entry['sections'].append(section)
        else:
            entry['author'] = {'name': compact(tree.xpath('//*[contains(@class,"article-meta")]/strong')[0].text_content()), 'role': compact(tree.xpath('//*[contains(@class,"article-meta")]/span')[0].text_content())}
            entry['cover'] = image(tree.xpath('//main//img')[0], page['url'], title + ' 대표 이미지')
            for section in tree.xpath('//section[contains(@class,"article-section")]'):
                paragraphs = [inline(p) for p in section.xpath('./p')]
                entry['sections'].append({'heading': compact(section.xpath('./h2')[0].text_content()), 'body': '\n\n'.join(plain(p) for p in paragraphs), 'paragraphs': paragraphs})
        # Guard against silently dropping text-only blocks or images on refresh.
        normalize = lambda value: re.sub(r'\s+', '', value)
        migrated = entry.get('summary', '') + ''.join(s['body'] for s in entry['sections'])
        for paragraph in tree.xpath('//main//p[not(ancestor::*[contains(@class,"project-info")])]'):
            assert normalize(paragraph.text_content()) in normalize(migrated), (entry['id'], 'Missing paragraph')
        image_count = int('cover' in entry) + sum('image' in s for s in entry['sections'])
        assert image_count == len(tree.xpath('//main//img')), (entry['id'], 'Missing image')
        entries.append(entry)

    (ROOT / 'src/data/portfolio-content.json').write_text(json.dumps(entries, ensure_ascii=False, indent=2) + '\n')
    print('Imported:', len(entries), 'entries;', sum(len(e['sections']) for e in entries), 'sections')


if __name__ == '__main__':
    main()
