export interface TrendItem {
  id: string;
  title: string;
  category: 'movie' | 'drama' | 'variety' | 'artist' | 'game';
  rank: number;
  previousRank: number;
  heat: number;
  heatChange: number;
  heatChangePercent: number;
  trend: 'up' | 'down' | 'stable';
  coverUrl: string;
  tags: string[];
  relatedKeywords: string[];
  discussions: number;
  description: string;
  reason?: string;
  platform?: string;
  region?: string;
}

export interface HeatPoint {
  time: string;
  value: number;
}

export interface TrendDetail extends TrendItem {
  heatHistory: HeatPoint[];
  hotDiscussions: Discussion[];
  relatedTopics: TrendItem[];
  notes?: string;
}

export interface Discussion {
  id: string;
  content: string;
  author: string;
  likes: number;
  time: string;
}

export interface FavoriteItem extends TrendItem {
  addedTime: string;
}

export interface AlertItem {
  id: string;
  trendId: string;
  title: string;
  threshold: number;
  currentValue: number;
  isActive: boolean;
  createdAt: string;
}

export type CategoryType = 'movie' | 'drama' | 'variety' | 'artist' | 'game' | 'all';

export const categoryMap: Record<CategoryType, string> = {
  all: '全部',
  movie: '电影',
  drama: '剧集',
  variety: '综艺',
  artist: '艺人',
  game: '游戏'
};