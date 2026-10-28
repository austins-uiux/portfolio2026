import { translate, translateText, localize } from '../i18n';
import { searchEntries } from '../data/portfolio';
import { AppLink } from '../lib/router';
import { ProjectCard } from '../components/ProjectCard';
import { EmptyState, SectionMark } from '../components/ui';

export function SearchPage({ query }: { query: string }) {
  const results = searchEntries(query);
  return <div className="listing-page content-container"><header className="page-heading"><SectionMark /><h1>{translate("검색 결과")}</h1><p>{localize(query ? `“${query}” 검색 결과 ${results.length}개` : '프로젝트 이름이나 키워드를 입력해 주세요.')}</p></header>{localize(results.length ? <div className="project-list text-list">{localize(results.map(entry => <ProjectCard key={entry.id} entry={entry} variant="text" />))}</div> : <EmptyState title={translateText(query ? '검색 결과가 없습니다.' : '어떤 프로젝트가 궁금하세요?')}><p>{translate("프로젝트 이름, 카테고리 또는 키워드로 다시 검색해 보세요.")}</p><AppLink href="/work/featured" className="text-link">{translate("대표 프로젝트 살펴보기 →")}</AppLink></EmptyState>)}</div>;
}
