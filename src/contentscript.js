// import { getLocalStorageRules } from './utils';
const getLocalStorageRules = () => {
  const rulesInLoacalStorage = localStorage.getItem('WXBADRemove');
  if (rulesInLoacalStorage) {
    const rules = JSON.parse(rulesInLoacalStorage);
    return rules;
  } else {
    return []
  }
}
const rules = getLocalStorageRules();
const currentLocation = window.location.href;
let matchIdGroup = [];
let matchClassGroup = [];
rules.forEach(rule => {
  const { URL } = rule;
  if (currentLocation.startsWith(URL) || currentLocation.includes(URL)) {
    matchIdGroup = rule.elementId;
    matchClassGroup = rule.elementClassName;
  }
});
let tags = document.body.getElementsByTagName('*');
for (let i = 0; i < tags.length; i++) {
  const { style, className, id } = tags[i];
  if (style.position === 'fixed' || matchIdGroup.includes(id) || matchClassGroup.includes(className)) {
    tags[i].style.display = 'none';
  }
}
