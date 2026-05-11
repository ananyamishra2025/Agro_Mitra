export const navigateTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const isActivePath = (currentPath, path) => {
  if (path === "/") return currentPath === "/";
  return currentPath.startsWith(path);
};