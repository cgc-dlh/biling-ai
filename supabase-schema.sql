-- =====================================================
-- 见鲸 (JianJing) - Supabase 数据库初始化脚本
-- =====================================================
-- 执行方式：在 Supabase Dashboard → SQL Editor 中运行此脚本
-- =====================================================

-- 1. 用户资料表（品牌分身数据）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  track TEXT DEFAULT '科技',
  persona TEXT DEFAULT '专家型',
  tone_tags TEXT[] DEFAULT '{}',
  forbidden_words TEXT[] DEFAULT '{}',
  sample_texts TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 收藏标题表
CREATE TABLE IF NOT EXISTS saved_titles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  score INTEGER,
  platform TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 日历计划表
CREATE TABLE IF NOT EXISTS calendar_plans (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  platform TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 邀请记录表
CREATE TABLE IF NOT EXISTS invitations (
  id BIGSERIAL PRIMARY KEY,
  inviter_email TEXT NOT NULL,
  invitee_email TEXT NOT NULL,
  invite_code TEXT NOT NULL,
  reward_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 使用次数统计表
CREATE TABLE IF NOT EXISTS usage_stats (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  titles_generated INTEGER DEFAULT 0,
  seo_analyzed INTEGER DEFAULT 0,
  content_optimized INTEGER DEFAULT 0,
  remaining_credits INTEGER DEFAULT 5,
  plan TEXT DEFAULT 'free',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 启用 Row Level Security (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS 策略：用户只能访问自己的数据
-- =====================================================

-- profiles 表策略
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- saved_titles 表策略
CREATE POLICY "Users can view own saved titles"
  ON saved_titles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved titles"
  ON saved_titles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved titles"
  ON saved_titles FOR DELETE
  USING (auth.uid() = user_id);

-- calendar_plans 表策略
CREATE POLICY "Users can view own calendar plans"
  ON calendar_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar plans"
  ON calendar_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar plans"
  ON calendar_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar plans"
  ON calendar_plans FOR DELETE
  USING (auth.uid() = user_id);

-- invitations 表策略
CREATE POLICY "Anyone can view invitations"
  ON invitations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert invitations"
  ON invitations FOR INSERT
  WITH CHECK (true);

-- usage_stats 表策略
CREATE POLICY "Users can view own usage stats"
  ON usage_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage stats"
  ON usage_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- 自动更新 updated_at 触发器
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_stats_updated_at
  BEFORE UPDATE ON usage_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
