import { TrendItem, TrendDetail, HeatPoint, Discussion, AlertItem } from '@/types';

const generateHeatHistory = (baseValue: number): HeatPoint[] => {
  const history: HeatPoint[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours().toString().padStart(2, '0');
    const variation = (Math.random() - 0.5) * baseValue * 0.3;
    history.push({
      time: `${hour}:00`,
      value: Math.max(0, baseValue + variation)
    });
  }
  return history;
};

const discussions: Discussion[] = [
  { id: '1', content: '这个剧情太精彩了，期待下一集！', author: '追剧达人', likes: 1234, time: '10分钟前' },
  { id: '2', content: '主演演技在线，强烈推荐！', author: '影评小王子', likes: 892, time: '25分钟前' },
  { id: '3', content: '没想到结局是这样，太意外了', author: '吃瓜群众', likes: 567, time: '1小时前' },
  { id: '4', content: '画面质感很棒，配乐也很赞', author: '文艺青年', likes: 432, time: '2小时前' },
  { id: '5', content: '熬夜看完了，根本停不下来', author: '夜猫子', likes: 789, time: '3小时前' }
];

export const mockTrends: TrendItem[] = [
  {
    id: '1',
    title: '热辣滚烫',
    category: 'movie',
    rank: 1,
    previousRank: 3,
    heat: 9856321,
    heatChange: 1256321,
    heatChangePercent: 14.5,
    trend: 'up',
    coverUrl: 'https://picsum.photos/id/1015/200/200',
    tags: ['喜剧', '家庭'],
    relatedKeywords: ['贾玲', '张小斐', '票房'],
    discussions: 125632,
    description: '贾玲执导并主演的喜剧电影，讲述一个普通女孩的成长故事',
    reason: '上映首周票房突破10亿，口碑爆棚',
    platform: '猫眼',
    region: '内地'
  },
  {
    id: '2',
    title: '繁花',
    category: 'drama',
    rank: 2,
    previousRank: 2,
    heat: 9234567,
    heatChange: 234567,
    heatChangePercent: 2.6,
    trend: 'stable',
    coverUrl: 'https://picsum.photos/id/1039/200/200',
    tags: ['年代', '剧情'],
    relatedKeywords: ['王家卫', '胡歌', '90年代'],
    discussions: 895432,
    description: '王家卫执导的年代剧，讲述90年代上海的繁华故事',
    reason: '大结局播出引发热议',
    platform: '腾讯视频',
    region: '内地'
  },
  {
    id: '3',
    title: '奔跑吧',
    category: 'variety',
    rank: 3,
    previousRank: 1,
    heat: 8765432,
    heatChange: -567890,
    heatChangePercent: -6.1,
    trend: 'down',
    coverUrl: 'https://picsum.photos/id/1080/200/200',
    tags: ['竞技', '真人秀'],
    relatedKeywords: ['李晨', '郑恺', 'Angelababy'],
    discussions: 456789,
    description: '国民级户外竞技真人秀节目',
    reason: '新一期嘉宾阵容引发争议',
    platform: '浙江卫视',
    region: '内地'
  },
  {
    id: '4',
    title: '周杰伦',
    category: 'artist',
    rank: 4,
    previousRank: 5,
    heat: 8234567,
    heatChange: 456789,
    heatChangePercent: 5.8,
    trend: 'up',
    coverUrl: 'https://picsum.photos/id/64/200/200',
    tags: ['歌手', '音乐人'],
    relatedKeywords: ['演唱会', '新歌', '专辑'],
    discussions: 789012,
    description: '华语乐坛天王级歌手，代表作《七里香》《青花瓷》',
    reason: '官宣新专辑即将发布',
    platform: '微博',
    region: '港台'
  },
  {
    id: '5',
    title: '王者荣耀',
    category: 'game',
    rank: 5,
    previousRank: 4,
    heat: 7890123,
    heatChange: -123456,
    heatChangePercent: -1.5,
    trend: 'down',
    coverUrl: 'https://picsum.photos/id/160/200/200',
    tags: ['MOBA', '手游'],
    relatedKeywords: ['皮肤', '赛事', '英雄'],
    discussions: 567890,
    description: '国民级MOBA手游，月活用户超5000万',
    reason: '新赛季更新内容未达预期',
    platform: '微信',
    region: '内地'
  },
  {
    id: '6',
    title: '封神第二部',
    category: 'movie',
    rank: 6,
    previousRank: 7,
    heat: 7234567,
    heatChange: 345678,
    heatChangePercent: 5.0,
    trend: 'up',
    coverUrl: 'https://picsum.photos/id/1018/200/200',
    tags: ['奇幻', '古装'],
    relatedKeywords: ['神话', '特效', '续集'],
    discussions: 345678,
    description: '封神系列第二部，场面宏大特效震撼',
    platform: '淘票票',
    region: '内地'
  },
  {
    id: '7',
    title: '三体',
    category: 'drama',
    rank: 7,
    previousRank: 6,
    heat: 6890123,
    heatChange: -234567,
    heatChangePercent: -3.3,
    trend: 'down',
    coverUrl: 'https://picsum.photos/id/2/200/200',
    tags: ['科幻', '小说改编'],
    relatedKeywords: ['刘慈欣', '科幻', '外星人'],
    discussions: 678901,
    description: '根据刘慈欣同名小说改编的科幻巨制',
    platform: '央视',
    region: '内地'
  },
  {
    id: '8',
    title: '赵丽颖',
    category: 'artist',
    rank: 8,
    previousRank: 10,
    heat: 6543210,
    heatChange: 567890,
    heatChangePercent: 9.5,
    trend: 'up',
    coverUrl: 'https://picsum.photos/id/91/200/200',
    tags: ['演员', '实力派'],
    relatedKeywords: ['新剧', '红毯', '代言'],
    discussions: 456789,
    description: '内地当红女演员，代表作《花千骨》《知否》',
    reason: '新剧路透曝光引发关注',
    platform: '微博',
    region: '内地'
  },
  {
    id: '9',
    title: '英雄联盟',
    category: 'game',
    rank: 9,
    previousRank: 8,
    heat: 6234567,
    heatChange: -123456,
    heatChangePercent: -2.0,
    trend: 'down',
    coverUrl: 'https://picsum.photos/id/8/200/200',
    tags: ['MOBA', '端游'],
    relatedKeywords: ['S赛', '皮肤', '电竞'],
    discussions: 567890,
    description: '全球最火爆的MOBA端游，电竞赛事影响力巨大',
    platform: '腾讯',
    region: '全球'
  },
  {
    id: '10',
    title: '极限挑战',
    category: 'variety',
    rank: 10,
    previousRank: 12,
    heat: 5890123,
    heatChange: 456789,
    heatChangePercent: 8.4,
    trend: 'up',
    coverUrl: 'https://picsum.photos/id/326/200/200',
    tags: ['竞技', '搞笑'],
    relatedKeywords: ['黄磊', '张艺兴', '孙红雷'],
    discussions: 234567,
    description: '东方卫视王牌综艺节目',
    reason: '新一季开播热度回升',
    platform: '东方卫视',
    region: '内地'
  }
];

export const getTrendDetail = (id: string): TrendDetail | undefined => {
  const trend = mockTrends.find(t => t.id === id);
  if (!trend) return undefined;
  
  return {
    ...trend,
    heatHistory: generateHeatHistory(trend.heat),
    hotDiscussions: discussions,
    relatedTopics: mockTrends.filter(t => t.category === trend.category && t.id !== id).slice(0, 3)
  };
};

export const mockAlerts: AlertItem[] = [
  {
    id: '1',
    trendId: '1',
    title: '热辣滚烫',
    threshold: 10000000,
    currentValue: 9856321,
    isActive: true,
    createdAt: '2024-01-15 10:30'
  },
  {
    id: '2',
    trendId: '4',
    title: '周杰伦',
    threshold: 9000000,
    currentValue: 8234567,
    isActive: true,
    createdAt: '2024-01-14 15:20'
  },
  {
    id: '3',
    trendId: '5',
    title: '王者荣耀',
    threshold: 8000000,
    currentValue: 7890123,
    isActive: false,
    createdAt: '2024-01-13 09:45'
  }
];

export const platforms = ['全部', '猫眼', '腾讯视频', '浙江卫视', '微博', '微信', '淘票票', '央视', '腾讯', '东方卫视'];

export const regions = ['全部', '内地', '港台', '全球'];