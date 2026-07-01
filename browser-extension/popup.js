const API_BASE = 'https://golden-gingersnap-790cb7.netlify.app';
const input = document.getElementById('input');
const result = document.getElementById('result');
const copyBtn = document.getElementById('copy');

let currentResult = '';

async function callAPI(type) {
  const text = input.value.trim();
  if (text.length < 10) {
    result.textContent = '请输入至少10个字的文本';
    result.classList.remove('loading');
    return;
  }
  if (type === 'seo' && text.length < 50) {
    result.textContent = 'SEO分析需要至少50个字的文本';
    result.classList.remove('loading');
    return;
  }
  if (type === 'optimize' && text.length < 30) {
    result.textContent = '内容优化需要至少30个字的文本';
    result.classList.remove('loading');
    return;
  }

  // 禁用按钮
  document.querySelectorAll('.btn').forEach(b => b.disabled = true);
  result.textContent = '';
  result.classList.add('loading');
  copyBtn.style.display = 'none';

  try {
    let endpoint, body;
    if (type === 'title') {
      endpoint = '/api/generate-titles';
      body = JSON.stringify({ content: text, count: 5, style: 'all' });
    } else if (type === 'seo') {
      endpoint = '/api/analyze-seo';
      body = JSON.stringify({ content: text, keyword: '' });
    } else {
      endpoint = '/api/optimize-content';
      body = JSON.stringify({ content: text, platform: 'wechat', action: 'adapt' });
    }

    const resp = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    const data = await resp.json();
    result.classList.remove('loading');

    if (type === 'title') {
      const titles = data.titles || [];
      currentResult = titles.map((t, i) => `${i+1}. ${t.title} (${t.score}分)`).join('\n');
      result.textContent = currentResult;
    } else if (type === 'seo') {
      const report = data.report || data;
      currentResult = `综合评分: ${report.overallScore}/100\n关键词密度: ${report.keywordDensity}\n可读性: ${report.readability}\n\n${(report.suggestions || []).join('\n')}`;
      result.textContent = currentResult;
    } else {
      currentResult = data.content || data.optimizedContent || '优化失败';
      result.textContent = currentResult;
    }
    copyBtn.style.display = 'block';
  } catch (err) {
    result.classList.remove('loading');
    result.textContent = '网络错误: ' + err.message;
  } finally {
    document.querySelectorAll('.btn').forEach(b => b.disabled = false);
  }
}

document.getElementById('btn-title').addEventListener('click', () => callAPI('title'));
document.getElementById('btn-seo').addEventListener('click', () => callAPI('seo'));
document.getElementById('btn-optimize').addEventListener('click', () => callAPI('optimize'));

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(currentResult).then(() => {
    copyBtn.textContent = '✅ 已复制！';
    setTimeout(() => { copyBtn.textContent = '📋 复制结果'; }, 2000);
  });
});
