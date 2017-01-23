export function getItem(key, fb) {
  const item = window.localStorage.getItem(key);

  if (item) {
    return JSON.parse(item);
  }

  return fb || null;
}

export function setItem(key, val) {
  window.localStorage.setItem(key, JSON.stringify(val));
}
