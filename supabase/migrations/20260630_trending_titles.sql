-- 热门标题排行表
-- 在 Supabase SQL Editor 中执行此脚本

create table if not exists trending_titles (
  id bigint generated always as identity primary key,
  title text not null,
  score integer not null default 80,
  platform text not null default '公众号',
  style text not null default '综合型',
  shares integer not null default 0,
  created_at timestamptz default now()
);

-- 允许匿名读取（无需登录即可查看热门排行）
alter table trending_titles enable row level security;

create policy "Allow anon read" on trending_titles
  for select to anon using (true);

-- 插入默认热门数据
insert into trending_titles (title, score, platform, style, shares)
values
  ('震惊！这个AI工具让内容创作者效率翻了10倍', 96, '公众号', '悬念型', 1234),
  ('2026年最值得关注的10个AI写作工具', 94, '知乎', '数字型', 987),
  ('我靠这个工具月入3万，今天坦白局', 92, '小红书', '故事型', 876),
  ('别再手动写标题了！AI一键生成100个高点击率标题', 91, '头条', '痛点型', 765),
  ('从0到10万粉，我只做对了这一件事', 90, '公众号', '故事型', 654),
  ('90%的人都不知道的内容写作技巧', 89, '知乎', '数字型', 543),
  ('这个AI工具，让我从文案小白变成爆款制造机', 88, '小红书', '对比型', 432),
  ('看完这篇，你的内容阅读量至少翻3倍', 87, '头条', '数字型', 321),
  ('后悔没有早点知道的标题写作秘籍', 86, '公众号', '痛点型', 298),
  ('AI写标题 vs 人工写标题，差距居然这么大', 85, '知乎', '对比型', 267)
on conflict do nothing;
