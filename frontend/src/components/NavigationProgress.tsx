"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { APP_NAV_START_EVENT } from "@/lib/navProgressEvents";

function shouldStartProgressFromAnchor(a: HTMLAnchorElement, e: MouseEvent): boolean {
  if (e.defaultPrevented) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (e.button !== 0) return false;
  if (a.target === "_blank" || a.hasAttribute("download")) return false;
  const hrefAttr = a.getAttribute("href");
  if (!hrefAttr || hrefAttr.startsWith("#")) return false;
  if (hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:") || hrefAttr.startsWith("javascript:")) {
    return false;
  }
  let url: URL;
  try {
    url = new URL(a.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  const next = `${url.pathname}${url.search}`;
  const current = `${window.location.pathname}${window.location.search}`;
  return next !== current;
}

/**
 * Top progress bar + corner throbber while App Router navigates (in-app links and programmatic pushes).
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams?.toString() ?? ""}`;
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [routeKey]);

  const start = useCallback(() => setActive(true), []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a[href]");
      if (!el || !(el instanceof HTMLAnchorElement)) return;
      if (!shouldStartProgressFromAnchor(el, e)) return;
      setActive(true);
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  useEffect(() => {
    window.addEventListener(APP_NAV_START_EVENT, start);
    return () => window.removeEventListener(APP_NAV_START_EVENT, start);
  }, [start]);

  if (!active) return null;

  return (
    <div className="nav-progress-root" role="status" aria-live="polite" aria-label="Loading page">
      <div className="nav-progress-bar" aria-hidden />
      <div className="nav-progress-throbber" aria-hidden>
        <span className="nav-progress-dot" />
        <span className="nav-progress-dot" />
        <span className="nav-progress-dot" />
      </div>
    </div>
  );
}
