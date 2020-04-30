chrome.extension.onMessage.addListener(function (request, _, sendResponse) {
  // 读取已存数据
  if (request.action == 'list') {
    let rules = [];
    const rulesInLoacalStorage = localStorage.getItem('WXBADRemove');
    if (rulesInLoacalStorage || rulesInLoacalStorage !== 'undefined') {
      rules = JSON.parse(rulesInLoacalStorage);
    }
    console.log('listlist::', rules);
    sendResponse(rules);
  }

  // 保存
  if (request.action == 'save') {
    const rulesString = JSON.stringify(request.data);
    localStorage.setItem('WXBADRemove', rulesString);
    sendResponse(true);
  }
});