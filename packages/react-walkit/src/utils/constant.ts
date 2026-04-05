import type { WalkitTheme } from '../types/Walkit.types';

const INJECT_WEB_REACT_WALKIT_ID = '__rw_styles__';
const WEB_PORTAL_ID = '__rw_portal__';

const WALKIT_STEP_WIDTH = 300;
const WALKIT_STEP_HEIGHT = 180;

const VIEWPORT_MARGIN = 16;
const DEFAULT_SCROLL_WAIT_MS = 300;

// ─── Default Walkit theme ────────────────────────────────────────────────────────────
const DEFAULT_THEME: Required<WalkitTheme> = {
  primaryButtonColor: '#6366f1',
  primaryButtonTextColor: '#ffffff',
  background: '#ffffff',
  titleColor: '#1e1e2e',
  subTitleColor: '#6b7280',
  border: '#e5e7eb',
  shadow: '',
  borderRadius: '5px',
};

export {
  DEFAULT_SCROLL_WAIT_MS,
  DEFAULT_THEME,
  INJECT_WEB_REACT_WALKIT_ID,
  VIEWPORT_MARGIN,
  WALKIT_STEP_HEIGHT,
  WALKIT_STEP_WIDTH,
  WEB_PORTAL_ID,
};
