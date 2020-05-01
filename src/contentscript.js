const currentLocation = window.location.href;
// const { origin, href: currentLocation } = window.location
const handleHidden = (idGroup, classGroup) => {
  let tags = document.body.getElementsByTagName('*');
  for (let i = 0; i < tags.length; i++) {
    handleHiddenSingle(tags[i], idGroup, classGroup);
  }
}
const handleHiddenSingle = (element, idGroup, classGroup) => {
  const { style, className, id } = element;
  // if (id) {
  //   console.log('id:', id, ' in:', idGroup.includes(id));
  // }
  // if (style.position) {
  //   console.log('style.position:', style.position);
  // }
  if (id || style || className) {
    if (style.position === 'fixed' || idGroup.includes(id) || classGroup.includes(className)) {
      element.style.display = 'none';
      element.style.width = '0px';
      element.style.height = '0px';
    }
  }
}
chrome.extension.sendMessage({ action: 'list', data: {} }, rules => {
  rules.forEach(rule => {
    const { URL } = rule;
    if (currentLocation.startsWith(URL) || currentLocation.includes(URL)) {
      const matchIdGroup = rule.elementId || [];
      const matchClassGroup = rule.elementClassName || [];
      handleHidden(matchIdGroup, matchClassGroup);
      document.body.addEventListener("DOMNodeInserted", (e) => {
        const element = e.target;
        handleHiddenSingle(element, matchIdGroup, matchClassGroup)
      })
    }
  });
});