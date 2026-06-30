// 右键菜单 + 消息传递
chrome.runtime.onInstalled.addListener(() => {
  // 创建右键菜单
  chrome.contextMenus.create({
    id: "jianjing-optimize",
    title: "用见鲸优化选中的文字",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "jianjing-title",
    title: "用见鲸生成标题",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "jianjing-seo",
    title: "用见鲸分析SEO",
    contexts: ["selection"]
  });
});

// 监听右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "jianjing-optimize") {
    chrome.tabs.sendMessage(tab.id, {
      action: "open-jianjing",
      type: "optimize",
      text: info.selectionText
    });
  } else if (info.menuItemId === "jianjing-title") {
    chrome.tabs.sendMessage(tab.id, {
      action: "open-jianjing",
      type: "title",
      text: info.selectionText
    });
  } else if (info.menuItemId === "jianjing-seo") {
    chrome.tabs.sendMessage(tab.id, {
      action: "open-jianjing",
      type: "seo",
      text: info.selectionText
    });
  }
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "copy-to-clipboard") {
    navigator.clipboard.writeText(message.text).then(() => {
      sendResponse({ success: true });
    });
  }
});
