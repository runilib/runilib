import { WEB_KEYFRAMES } from '../animations';
import {
  DEFAULT_SCROLL_WAIT_MS,
  INJECT_WEB_REACT_WALKIT_ID,
  VIEWPORT_MARGIN,
  WEB_PORTAL_ID,
} from './constant';

export function injectStyles(): void {
  if (document.getElementById(INJECT_WEB_REACT_WALKIT_ID)) return;
  const style = document.createElement('style');
  style.id = INJECT_WEB_REACT_WALKIT_ID;
  style.type = 'text/css';
  style.textContent = WEB_KEYFRAMES;
  document.head.appendChild(style);
}

export function getOrCreatePortal(): HTMLElement {
  let element = document.getElementById(WEB_PORTAL_ID);
  if (!element) {
    element = document.createElement('div');
    element.id = WEB_PORTAL_ID;
    document.body.appendChild(element);
  }
  return element;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function isElementVisibleInViewport(
  element: HTMLElement,
  margin = VIEWPORT_MARGIN,
) {
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.top >= margin &&
    rect.left >= margin &&
    rect.bottom <= viewportHeight - margin &&
    rect.right <= viewportWidth - margin
  );
}

export function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function waitForScrollToSettle(waitMs = DEFAULT_SCROLL_WAIT_MS): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, waitMs);
  });
}
