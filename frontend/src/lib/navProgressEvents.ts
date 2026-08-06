/** Dispatched before programmatic client navigations so the global progress UI can show. */
export const APP_NAV_START_EVENT = "modern-lms:nav-start";

export function signalAppNavigationStart(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(APP_NAV_START_EVENT));
}
