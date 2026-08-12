export function signalAppNavigationStart() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("app:navigate:start"));
  } catch (_e) {
    // noop
  }
}
