const currentLocation = window.location.href;
chrome.extension.sendMessage({ action: 'list', data: {} }, rules => {
  rules.forEach(rule => {
    const { URL } = rule;
    if (currentLocation.startsWith(URL) || currentLocation.includes(URL)) {
      const matchIdGroup = rule.elementId || [];
      const matchClassGroup = rule.elementClassName || [];
      console.log('matchIdGroup:', matchIdGroup);
      let tags = document.body.getElementsByTagName('*');
      for (let i = 0; i < tags.length; i++) {
        const { style, className, id } = tags[i];
        if (id) {
          console.log('id:', id, ' in:', matchIdGroup.includes(id));
        }
        if (style.position) {
          console.log('style.position:', style.position);
        }
        if (style.position === 'fixed' || matchIdGroup.includes(id) || matchClassGroup.includes(className)) {
          tags[i].style.display = 'none';
          tags[i].style.width = 0;
          tags[i].style.height = 0;
          console.log('tags[i].style:', tags[i].style);
        }
      }
    }
  });
});