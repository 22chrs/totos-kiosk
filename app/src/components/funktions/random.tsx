export function getScrollHeight() {
  const { body, documentElement } = document;
  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    documentElement.clientHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight
  );
  return height;
}

export function getElementHeightById(id) {
  const element = document.getElementById(id);
  if (element) {
    return element.clientHeight;
  } else {
    return 0;
  }
}

export function getWindowHeight() {
  return window.innerHeight;
}
