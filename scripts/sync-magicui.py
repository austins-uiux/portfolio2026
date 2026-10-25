#!/usr/bin/env python3
"""Explicitly snapshot Magic UI's public component catalog and MIT sources."""
import concurrent.futures, datetime, importlib.util, json, re, sys, urllib.request
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DOCS='https://magicui.design/docs/components'
REGISTRY='https://magicui.design/r/'
# Explicitly excluded from this portfolio; keep removed examples out on refresh.
EXCLUDED={'bento-grid','globe','dotted-map','cool-mode','video-text'}
spec=importlib.util.spec_from_file_location('magic_adapters', ROOT/'scripts/magicui-adapters.py')
adapters=importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapters)
class ComponentIndex(HTMLParser):
    def __init__(self): super().__init__(); self.items={}; self.href=None; self.text=''
    def handle_starttag(self,tag,attrs):
        if tag=='a': self.href=dict(attrs).get('href'); self.text=''
    def handle_data(self,data):
        if self.href:self.text+=data
    def handle_endtag(self,tag):
        if tag=='a' and self.href:
            if re.fullmatch(r'/docs/components/[a-z0-9-]+',self.href): self.items[self.href]=self.text.strip()
            self.href=None

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'AplusStudio-MagicSync/1.0'}),timeout=45) as response:return response.read().decode()
def get(name):
    try:return name,json.loads(fetch(REGISTRY+name+'.json'))
    except Exception as error:
        try:
            path='apps/www/registry/magicui/'+name+'.tsx'
            content=fetch('https://raw.githubusercontent.com/magicuidesign/magicui/main/'+path)
            return name,{'name':name,'type':'registry:ui','files':[{'path':path,'content':content,'type':'registry:ui'}],'sourceFallback':'official GitHub'}
        except Exception as fallback:return name,{'error':str(fallback)}
def css_rule(selector,values):
    declarations=[];nested=[]
    for key,value in values.items():
        if isinstance(value,dict):nested.append(css_rule(key,value))
        else:
            prop=re.sub(r'([A-Z])',lambda m:'-'+m.group(1).lower(),key)
            declarations.append(prop+': '+str(value)+';')
    return selector+' { '+' '.join(declarations)+'\n'+'\n'.join(nested)+' }'
def main():
    cache=ROOT/'vendor/magicui/registry';cache.mkdir(parents=True,exist_ok=True)
    if '--offline' in sys.argv:
        catalog=json.loads((ROOT/'src/data/magicui-catalog.json').read_text());items={p.stem:json.loads(p.read_text()) for p in cache.glob('*.json') if p.stem not in EXCLUDED}
    else:
        parser=ComponentIndex();parser.feed(fetch(DOCS))
        catalog=[{'id':path.rsplit('/',1)[-1],'name':name,'docs':'https://magicui.design'+path} for path,name in parser.items.items()]
        catalog=[item for item in catalog if item['id'] not in EXCLUDED]
        if len(catalog)<50:raise RuntimeError('Unexpected component index. No source files were replaced.')
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:items=dict(pool.map(get,[item['id'] for item in catalog]))
        failures={name:item['error'] for name,item in items.items() if 'error' in item}
        for name,item in items.items():
            if 'error' not in item:(cache/(name+'.json')).write_text(json.dumps(item,ensure_ascii=False,indent=2)+'\n')
        (ROOT/'src/data/magicui-catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
        if failures:print('Registry items requiring source lookup:',json.dumps(failures))
    css=[];theme={};manifest=[]
    animations={key.removeprefix('animate-') for item in items.values() for key in item.get('cssVars',{}).get('theme',{}) if key.startswith('animate-')}
    def namespace(value):
        for animation in sorted(animations,key=len,reverse=True):
            value=re.sub(r'(?<![a-zA-Z0-9_-])'+re.escape(animation)+r'(?![a-zA-Z0-9_-])','magic-'+animation,value)
        return value
    for name,item in items.items():
        if 'error' in item:continue
        for file in item.get('files',[]):
            if file.get('type')!='registry:ui' or not file['path'].endswith('.tsx'):continue
            source=file['content'].replace('@/lib/utils','@/lib/shadcn-utils')
            source=re.sub(r'@/(?:registry/[^\"]*magicui|components/magicui)/','@/components/magic-ui/',source)
            source=source.replace('@/components/ui/','@/components/lab-ui/')
            target=ROOT/'src/components/magic-ui'/Path(file['path']).name
            source=adapters.adapt(name,source)
            for animation in sorted(animations,key=len,reverse=True):
                source=source.replace('animate-'+animation,'animate-magic-'+animation)
                source=re.sub(r'([\"`])'+re.escape(animation)+r'(?=\s)',r'\1magic-'+animation,source)
            target.write_text('// Adapted from Magic UI (MIT). See vendor/magicui/LICENSE.md.\n'+source)
            manifest.append({'item':name,'upstreamPath':file['path'],'localPath':str(target.relative_to(ROOT))})
        theme.update({key.replace('animate-','animate-magic-',1) if key.startswith('animate-') else key: namespace(str(value)) for key,value in item.get('cssVars',{}).get('theme',{}).items()})
        css.extend(namespace(css_rule(k,v)) for k,v in item.get('css',{}).items())
    themed='@theme inline {\n'+'\n'.join('--'+k+': '+str(v)+';' for k,v in theme.items())+'\n}\n'
    (ROOT/'src/styles/magic-animations.css').write_text('/* Official registry animations; Magic UI MIT license. */\n'+themed+'\n'+'\n'.join(dict.fromkeys(css))+'\n')
    (ROOT/'vendor/magicui/manifest.json').write_text(json.dumps({'source':DOCS,'registry':REGISTRY,'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'components':len(catalog),'files':manifest},indent=2)+'\n')
    print('Catalog:',len(catalog),'Sources:',len(manifest))
    print('Dependencies:',sorted({d for item in items.values() for d in item.get('dependencies',[])}))
if __name__=='__main__':main()
