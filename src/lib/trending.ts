export interface TrendingTitle {
  title: string;
  score: number;
  platform: string;
  style: string;
  shares: number;
}

export const DEFAULT_TRENDING: TrendingTitle[] = [
  { title: '震惊！这个AI工具让内容创作者效率翻了10倍', score: 96, platform: '公众号', style: '悬念型', shares: 1234 },
  { title: '2026年最值得关注的10个AI写作工具', score: 94, platform: '知乎', style: '数字型', shares: 987 },
  { title: '我靠这个工具月入3万，今天坦白局', score: 92, platform: '小红书', style: '故事型', shares: 876 },
  { title: '别再手动写标题了！AI一键生成100个高点击率标题', score: 91, platform: '头条', style: '痛点型', shares: 765 },
  { title: '从0到10万粉，我只做对了这一件事', score: 90, platform: '公众号', style: '故事型', shares: 654 },
  { title: '90%的人都不知道的内容写作技巧', score: 89, platform: '知乎', style: '数字型', shares: 543 },
  { title: '这个AI工具，让我从文案小白变成爆款制造机', score: 88, platform: '小红书', style: '对比型', shares: 432 },
  { title: '看完这篇，你的内容阅读量至少翻3倍', score: 87, platform: '头条', style: '数字型', shares: 321 },
  { title: '后悔没有早点知道的标题写作秘籍', score: 86, platform: '公众号', style: '痛点型', shares: 298 },
  { title: 'AI写标题 vs 人工写标题，差距居然这么大', score: 85, platform: '知乎', style: '对比型', shares: 267 },
];

export async function loadTrendingTitles(): Promise<TrendingTitle[]> {
  try {
    const res = await fetch('/api/trending-titles');
    if (!res.ok) return DEFAULT_TRENDING;
    const data = await res.json() as TrendingTitle[];
    if (data.length > 0) return data;
  } catch {
    // 网络错误或 Supabase 表不存在，回退到默认数据
  }
  return DEFAULT_TRENDING;
}
