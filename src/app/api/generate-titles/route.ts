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
}): string {
  if (!brand) return '';
  const parts: string[] = [];
  if (brand.track) parts.push(`- 赛道领域：${brand.track}`);
  if (brand.persona) parts.push(`- 人设定位：${brand.persona}`);
  if (brand.toneTags?.length) parts.push(`- 文风要求：${brand.toneTags.join('、')}`);
  if (brand.forbiddenWords?.trim()) {
    const words = brand.forbiddenWords.split('\n').filter(w => w.trim());
    if (words.length) parts.push(`- 禁用词：${words.join('、')}（生成内容中请勿出现以上词汇）`);
  }

  let context = parts.length ? `\n\n【品牌风格要求】\n${parts.join('\n')}\n` : '';

  if (brand.sampleTexts?.length) {
    const samples = brand.sampleTexts.slice(0, 5).map((s, i) => `范文${i + 1}：${s}`).join('\n\n');
    context += `\n【你的文风参考范文】请模仿以下范文的文风、语气和表达方式：\n${samples}\n`;
  }

  return context;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder-key') {
      return NextResponse.json({ error: 'API未配置' }, { status: 500 });
    }

    const { content, count = 5, style = 'all', brand } = await request.json();

    if (count < 1 || count > 10) {
      return NextResponse.json({ error: '生成数量必须在1到10之间' }, { status: 400 });
    }
    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: '内容太短，请至少输入10个字' }, { status: 400 });
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: '内容过长，请控制在5000字以内' }, { status: 400 });
    }

    const validStyles = ['all', 'suspense', 'number', 'pain', 'story', 'compare'];
    if (!validStyles.includes(style)) {
      return NextResponse.json({ error: `不支持的标题风格，可选值：${validStyles.join('、')}` }, { status: 400 });
    }

    const styleMap: Record<string, string> = {
      all: 'suspense, number, pain point, story, comparison',
      suspense: 'suspense (trigger curiosity)',
      number: 'number type (specific numbers attract clicks)',
      pain: 'pain point (hit user pain points directly)',
      story: 'story type (resonate through stories)',
      compare: 'comparison type (before-and-after contrast)',
    };

    const styleDesc = styleMap[style] || styleMap.all;
    const brandCtx = buildBrandContext(brand);

    const prompt = `You are a top-tier Chinese content title expert. Based on the following content, generate ${count} high-click-rate Chinese titles.
${brandCtx}
Requirements:
- Title styles: ${styleDesc}
- Each title should be 15-30 Chinese characters
- Attractive but not clickbait
- Each title includes an estimated click-through rate score (0-100)
- Format: one title per line, format "Title text | Score"

Content:
${content.trim()}

Please output titles and scores directly in Chinese, no other text.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const raw = response.choices[0]?.message?.content || '';
    const titles = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.includes('|'))
      .map((line) => {
        const parts = line.split('|');
        const title = parts[0].replace(/^\d+[\.\、\)）]\s*/, '').trim();
        const score = parseInt(parts[1]?.trim() || '75', 10);
        return { title, score: Math.min(100, Math.max(0, score)) };
      })
      .slice(0, count);

    if (titles.length === 0) {
      return NextResponse.json({
        titles: raw
          .split('\n')
          .filter((l) => l.trim())
          .slice(0, count)
          .map((t, i) => ({ title: t.replace(/^\d+[\.\、\)）]\s*/, '').trim(), score: 80 - i * 3 })),
      }, { status: 200 });
    }

    return NextResponse.json({ titles }, { status: 200 });
  } catch (error: unknown) {
    console.error('Generate titles error:', error);
    const message = error instanceof Error ? error.message : '服务器错误';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
