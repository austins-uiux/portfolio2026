export type CategoryId = 'featured' | 'ux' | 'ai-workflow' | 'component-lab' | 'interaction-lab' | 'design-system' | 'archive' | 'thinking' | 'design-trend';
export type IconName = 'home' | 'featured' | 'ux' | 'ai' | 'component' | 'interaction' | 'system' | 'archive' | 'thinking' | 'flame' | 'collapse' | 'expand' | 'search' | 'sun' | 'github' | 'spark' | 'arrow' | 'close' | 'send' | 'external';

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  homeDescription?: string;
  icon: IconName;
  layout: 'grid-2' | 'grid-3' | 'text-list' | 'foundation-list';
  figmaNode: string;
}

export interface ContentImage { src: string; alt: string; width?: number; height?: number }
export interface ContentInline { text: string; strong?: boolean }
export interface ContentSection {
  heading: string;
  body: string;
  image?: ContentImage;
  paragraphs?: ContentInline[][];
}

export interface PortfolioEntry {
  id: string;
  category: CategoryId;
  title: string;
  meta: string;
  kind?: 'project' | 'article';
  detailTitle?: string;
  summary?: string;
  facts?: { label: string; value: string }[];
  author?: { name: string; role: string };
  cover?: ContentImage;
  thumbnail?: ContentImage;
  uxApp?: { name: string; category: string; icon: string };
  foundation?: 'Color' | 'Typography' | 'Shape' | 'Icons' | 'Components';
  sections: ContentSection[];
  sourceUrl?: string;
  sourceLabel?: string;
  listed?: boolean;
}

export interface ChatAttachment { entryId: string; title: string; description: string; thumbnail?: string }
export interface ChatMessage { id: string; role: 'user' | 'assistant'; text: string; attachments?: ChatAttachment[] }
