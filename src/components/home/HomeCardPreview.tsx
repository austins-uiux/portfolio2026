import { translateText, localize } from '../../i18n';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { workflowTools } from '../../data/ai-workflow';
import { getEntry } from '../../data/portfolio';
import { makeDemoSVG } from '../../lib/ut-lab-demo';
import { StudioCardExample } from '../lab/StudioCardExample';
import { ColorArtwork } from '../system/ColorArtwork';
import { UtConceptPhone } from '../ut/UtConceptPhone';
import type { CategoryId } from '../../types';

const DiaRevealExample=lazy(()=>import('../interaction/DiaRevealExample'));
const beforeSample=makeDemoSVG(0);

function MotionPreview() {
  const ref=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    if(!ref.current)return;
    const observer=new IntersectionObserver(entries=>setVisible(entries.some(entry=>entry.isIntersecting)),{rootMargin:'80px'});
    observer.observe(ref.current);return()=>observer.disconnect();
  },[]);
  return <div className="home-motion-preview" ref={ref}>{localize(visible?<Suspense fallback={<span className="magic-type">Make it clear.</span>}><DiaRevealExample/></Suspense>:<span className="magic-type">Make it clear.</span>)}</div>;
}
export function HomeCardPreview({id}:{id:CategoryId}) {
  if(id==='featured') {
    const image=getEntry('tada-rider')!.sections[0].image!;
    return <img className="home-featured-image" src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async"/>;
  }
  if(id==='thinking') {
    const image=getEntry('thinking-3')!.thumbnail!;
    return <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async"/>;
  }
  if(id==='ux') return <div className="home-ux-comparison"><div><span>Before</span><div className="home-ux-phone"><div className="ut-phone ut-phone--before"><img src={beforeSample} alt="" width="284" height="512"/></div></div></div><ArrowRight className="home-ux-arrow" size={20}/><div><span>After</span><div className="home-ux-phone"><UtConceptPhone/></div></div></div>;
  if(id==='ai-workflow') return <div className="home-tools-grid">{localize(workflowTools.map(tool=><span className="home-tool-logo" key={tool.name} title={translateText(tool.name)}>{localize(tool.dark?<span className="brand-image"><img className="brand-light" src={tool.src} width="30" height="30" alt=""/><img className="brand-dark" src={tool.dark} width="30" height="30" alt=""/></span>:<img src={tool.src} width="30" height="30" alt=""/>)}</span>))}</div>;
  if(id==='component-lab') return <div className="home-component-preview"><StudioCardExample decorative/></div>;
  if(id==='interaction-lab') return <MotionPreview/>;
  if(id==='design-system') return <div className="home-color-preview"><ColorArtwork/></div>;
  return null;
}
