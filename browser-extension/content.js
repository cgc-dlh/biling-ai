// 内容脚本 - 注入到每个页面
let popupVisible = false;

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open-jianjing") {
    togglePopup(message);
    sendResponse({ success: true });
  }
});

function togglePopup(message) {
  if (popupVisible) {
    removePopup();
    return;
  }

  const container = document.createElement('div');
  container.id = 'jianjing-popup';
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    max-height: 80vh;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    z-index: 999999;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // 遮罩层
  const overlay = document.createElement('div');
  overlay.id = 'jianjing-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999998;
  `;

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #eee;">
      <h3 style="margin:0;font-size:18px;color:#1a1a2e;">🐳 见鲸 AI 优化</h3>
      <button id="jianjing-close" style="border:none;background:none;font-size:24px;cursor:pointer;color:#999;">×</button>
    </div>
    <div style="padding:16px 20px;">
      <p style="margin:0 0 12px 0;color:#666;font-size:14px;">选中文字：<span style="color:#333;">${message.text.substring(0, 100)}${message.text.length > 100 ? '...' : ''}</span></p>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <button class="jianjing-btn" data-type="title" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;background:#f8f9fa;cursor:pointer;font-size:14px;">📝 生成标题</button>
        <button class="jianjing-btn" data-type="seo" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;background:#f8f9fa;cursor:pointer;font-size:14px;">🔍 SEO分析</button>
        <button class="jianjing-btn" data-type="optimize" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;background:#f8f9fa;cursor:pointer;font-size:14px;">✨ 内容优化</button>
      </div>
      <div id="jianjing-result" style="min-height:100px;padding:12px;background:#f8f9fa;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;"></div>
      <button id="jianjing-copy" style="width:100%;padding:10px;margin-top:12px;border:1px solid #007bff;border-radius:6px;background:#007bff;color:white;cursor:pointer;font-size:14px;display:none;">📋 复制结果</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(container);
  popupVisible = true;

  // 关闭按钮
  document.getElementById('jianjing-close').addEventListener('click', () => {
    removePopup();
  });

  overlay.addEventListener('click', () => {
    removePopup();
  });

  // 功能按钮
  document.querySelectorAll('.jianjing-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const type = btn.dataset.type;
      const resultDiv = document.getElementById('jianjing-result');
      const copyBtn = document.getElementById('jianjing-copy');
      
      resultDiv.textContent = '⏳ AI 处理中...';
      copyBtn.style.display = 'none';

      try {
        let apiEndpoint = '';
        let requestBody = {};

        if (type === 'title') {
          apiEndpoint = '/api/generate-titles';
          requestBody = { content: message.text, count: 5, style: 'all' };
        } else if (type === 'seo') {
          apiEndpoint = '/api/analyze-seo';
          requestBody = { content: message.text, keyword: '' };
        } else if (type === 'optimize') {
          apiEndpoint = '/api/optimize-content';
          requestBody = { content: message.text, platform: 'wechat', action: 'adapt' };
        }

        const response = await fetch('https://golden-gingersnap-790cb7.netlify.app' + apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (type === 'title') {
          const titles = data.titles || [];
          resultDiv.textContent = titles.map((t, i) => `${i+1}. ${t.title} (${t.score}分)`).join('\n');
          copyBtn.style.display = titles.length > 0 ? 'block' : 'none';
        } else if (type === 'seo') {
          const report = data.report || data;
          resultDiv.textContent = `综合评分: ${report.overallScore || 0}/100\n关键词密度: ${report.keywordDensity || 'N/A'}\n可读性: ${report.readability || 'N/A'}\n\n${(report.suggestions || []).join('\n')}`;
          copyBtn.style.display = 'block';
        } else if (type === 'optimize') {
          const optimized = data.content || data.optimizedContent || '';
          resultDiv.textContent = optimized;
          copyBtn.style.display = optimized ? 'block' : 'none';
        }
      } catch (err) {
        resultDiv.textContent = '❌ 网络错误: ' + err.message;
      }
    });
  });

  // 复制按钮
  document.getElementById('jianjing-copy').addEventListener('click', () => {
    const text = document.getElementById('jianjing-result').textContent;
    navigator.clipboard.writeText(text).then(() => {
      const copyBtn = document.getElementById('jianjing-copy');
      copyBtn.textContent = '✅ 已复制！';
      setTimeout(() => {
        copyBtn.textContent = '📋 复制结果';
      }, 2000);
    });
  });
}

function removePopup() {
  const popup = document.getElementById('jianjing-popup');
  const overlay = document.getElementById('jianjing-overlay');
  if (popup) popup.remove();
  if (overlay) overlay.remove();
  popupVisible = false;
}
