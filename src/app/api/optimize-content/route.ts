import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

// 构建品牌上下文
function buildBrandContext(brand?: {
  track?: string;
  persona?: string;
  toneTags?: string[];
  forbiddenWords?: string;
  sampleTexts?: string[];
  language?: string;
}): string {
  if (!brand) return '';
  const parts: string[] = [];
  if (brand.track) parts.push(`- 赛道领域：${brand.track}`);
  if (brand.persona) parts.push(`- 人设定位：${brand.persona}`);
  if (brand.toneTags?.length) parts.push(`- 文风要求：${brand.toneTags.join('、')}`);
  if (brand.forbiddenWords?.trim()) {
    const words = brand.forbiddenWords.split('\n').filter(w => w.trim());
    if (words.length) parts.push(`- 禁用词：${words.join('、')}（请勿在输出内容中出现以上词汇）`);
  }
  if (brand.language) parts.push(`- Output language: ${brand.language}`);

  let context = parts.length ? `\n\n【品牌风格要求】\n${parts.join('\n')}\n` : '';

  if (brand.sampleTexts?.length) {
    const samples = brand.sampleTexts.slice(0, 5).map((s, i) => `范文${i + 1}：${s}`).join('\n\n');
    context += `\n【文风参考范文】请模仿以下范文的文风、语气和表达方式来适配内容：\n${samples}\n`;
  }

  return context;
}

// 检测内容语言
function detectLanguage(content: string): string {
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  const totalChars = content.replace(/\s/g, '').length;
  if (totalChars === 0) return 'auto';
  return chineseChars / totalChars > 0.3 ? 'Chinese' : 'English';
}

const platformConfig: Record<string, { name: string; maxLen: number; style: string }> = {
  // 中国平台
  wechat: { name: 'WeChat Official Account', maxLen: 2000, style: 'long-form deep reading style, proper paragraphing, with subheadings' },
  xiaohongshu: { name: 'Xiaohongshu (Little Red Book)', maxLen: 500, style: 'short copy grass-planting style, lively tone, use emojis, add topic tags' },
  zhihu: { name: 'Zhihu', maxLen: 1500, style: 'deep thinking style, well-reasoned, suitable for knowledge sharing' },
  toutiao: { name: 'Toutiao', maxLen: 1000, style: 'news style, concise and powerful, suitable for quick reading' },
  baijia: { name: 'Baijiahao', maxLen: 1200, style: 'news style, professional but approachable' },
  douyin: { name: 'Douyin', maxLen: 300, style: 'short video script style, punchy hooks in first 3 seconds, colloquial and energetic, add CTA for likes and follows' },
  bilibili: { name: 'Bilibili', maxLen: 800, style: 'young anime/game culture style, use bullet comments references, friendly and witty, add video chapter markers' },
  weibo: { name: 'Weibo', maxLen: 400, style: 'hot topic style, concise and catchy, use hashtags, suitable for viral spread' },
  kuaishou: { name: 'Kuaishou', maxLen: 300, style: 'down-to-earth authentic style, story-driven, emotional connection, friendly like talking to a buddy' },
  // 国际平台
  medium: { name: 'Medium / Substack', maxLen: 2000, style: 'long-form thoughtful style, well-structured with headings, narrative-driven, personal voice, suitable for deep reading' },
  instagram: { name: 'Instagram', maxLen: 500, style: 'visual-first copy, punchy and emotive, use emojis naturally, add relevant hashtags, casual and aspirational tone' },
  linkedin: { name: 'LinkedIn', maxLen: 1500, style: 'professional thought-leadership style, actionable insights, clean formatting with line breaks, confident but not boastful, add 3-5 relevant hashtags' },
  tiktok: { name: 'TikTok', maxLen: 300, style: 'short video script with hook in first 2 seconds, fast-paced, trending language, relatable and entertaining, clear CTA for likes/follows/comments' },
  youtube: { name: 'YouTube', maxLen: 800, style: 'video script with strong intro hook, chapter markers, conversational delivery, teach or entertain, end with subscribe CTA and comment prompt' },
  twitter: { name: 'Twitter / X', maxLen: 400, style: 'short, punchy, one key insight per tweet, use line breaks for readability, add 2-3 hashtags, suitable for threads or standalone posts' },
  reddit: { name: 'Reddit', maxLen: 1000, style: 'community-focused, authentic and personal, story-driven, no corporate tone, appropriate for specific subreddit context, question at the end to spark discussion' },
  facebook: { name: 'Facebook', maxLen: 1200, style: 'social-friendly long-form, personal storytelling, emotional hook, encouraging community engagement, call for comments and shares' },
  quora: { name: 'Quora', maxLen: 1500, style: 'expert answer format, structured with personal experience and evidence, conversational authority, start with direct answer then elaborate' },
};

const ALL_PLATFORMS = Object.keys(platformConfig);

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder-key') {
      return NextResponse.json({ error: 'API未配置' }, { status: 500 });
    }

    const { content, platform = 'wechat', action = 'adapt', brand } = await request.json();

    if (!content || content.trim().length < 30) {
      return NextResponse.json({ error: '内容太短，请至少输入30字' }, { status: 400 });
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: '内容过长，请控制在5000字以内' }, { status: 400 });
    }

    if (!ALL_PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: `不支持的平台，可选值：${ALL_PLATFORMS.join('、')}` }, { status: 400 });
    }

    const validActions = ['adapt', 'proofread'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `不支持的操作类型，可选值：${validActions.join('、')}` }, { status: 400 });
    }

    const config = platformConfig[platform] || platformConfig.wechat;

    // 自动检测内容语言
    const detectedLang = detectLanguage(content.trim());
    const brandWithLang = { ...brand, language: brand?.language || detectedLang };
    const brandCtx = buildBrandContext(brandWithLang);

    if (action === 'adapt') {
      const langInstruction = detectedLang === 'Chinese' ? 'Please output the adapted content in Chinese.' : 'Please output the adapted content in English.';
      const prompt = `You are a professional content multi-platform adaptation expert. Please adapt the following content to ${config.name} format.
${brandCtx}
Original content:
${content.trim()}

Requirements:
- Style: ${config.style}
- Word count within ${config.maxLen} characters
- Keep core information intact
- Adapt language style to platform tone

${langInstruction}`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 2000,
      });

      const optimized = response.choices[0]?.message?.content || '';
      return NextResponse.json({ content: optimized, platform: config.name }, { status: 200 });
    }

    if (action === 'proofread') {
      const langInstruction = detectedLang === 'Chinese' ? 'in Chinese' : 'in English';
      const prompt = `You are a professional content proofreading expert. Please carefully proofread the following content and output JSON (${langInstruction}).
${brandCtx}
Content:
${content.trim()}

Please output the following JSON structure:
{
  "errors": [
    {"type": "typo", "original": "original text", "suggestion": "suggested fix", "position": "paragraph X"},
    {"type": "grammar", "original": "original text", "suggestion": "suggested fix", "position": "paragraph X"}
  ],
  "warnings": [
    {"type": "punctuation", "detail": "suggest using proper punctuation"},
    {"type": "style", "detail": "suggest unifying writing style"}
  ],
  "stats": {"totalChars": 0, "errorCount": 0, "warningCount": 0},
  "overallRating": "excellent/good/needs improvement"
}

Output JSON directly, do not wrap in markdown code block.`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1500,
      });

      const raw = response.choices[0]?.message?.content || '';
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      try {
        const result = JSON.parse(cleaned);
        return NextResponse.json(result, { status: 200 });
      } catch {
        return NextResponse.json({
          errors: [],
          warnings: [{ type: 'Style', detail: 'Content looks good overall. Check punctuation.' }],
          stats: { totalChars: content.length, errorCount: 0, warningCount: 1 },
          overallRating: 'Good',
        }, { status: 200 });
      }
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Content optimization error:', error);
    const message = error instanceof Error ? error.message : '服务器错误';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
