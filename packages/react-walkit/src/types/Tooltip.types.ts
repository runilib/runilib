import type { ReactNode } from 'react';

export type TooltipPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right';

export type TooltipContentApi = {
  toggle: () => void;
  hide: () => void;
  show: () => void;
  visible: boolean;
  tooltipId?: string;
};

export type TooltipTrigger = ReactNode | ((api: TooltipContentApi) => ReactNode);

export type TooltipProps = {
  /**
   * Trigger element.
   * You can pass it through `anchor` or `children`.
   */
  anchor?: TooltipTrigger;
  children?: TooltipTrigger;

  /**
   * Default content.
   */
  content?: ReactNode;

  /**
   * Fully custom content.
   * If provided, the lib does not apply the default visual bubble styles.
   * Only a positioning shell remains.
   */
  renderContent?: (api: TooltipContentApi) => ReactNode;

  placement?: TooltipPlacement;
  offset?: number;
  disabled?: boolean;

  /**
   * Stable accessibility id for the tooltip surface.
   * Web: applied to the tooltip shell and used by `aria-describedby`.
   * Native: used as the nativeID for platforms that support accessibility
   * relationships.
   */
  id?: string;

  /**
   * Accessible label for the tooltip surface.
   * Especially useful when `interactive` makes the web surface a dialog.
   */
  ariaLabel?: string;

  /**
   * Link the trigger wrapper to the tooltip with aria-describedby on web.
   * - "visible": link only while the tooltip is rendered.
   * - "always": keep a stable relationship even before the tooltip opens.
   * - false: do not add aria-describedby.
   */
  ariaDescribedBy?: 'visible' | 'always' | false;

  /**
   * Close an open tooltip when Escape is pressed on web.
   */
  closeOnEscape?: boolean;

  /**
   * Use dialog-like semantics for content that contains focusable controls.
   * Keep false for descriptive, non-interactive tooltips.
   */
  interactive?: boolean;

  /**
   * Web/Native shared trigger options
   */
  openOnHover?: boolean;
  openOnPress?: boolean;
  closeOnOutsidePress?: boolean;

  /**
   * Layout / visual options
   */
  maxWidth?: number;
  zIndex?: number;

  /**
   * Default tooltip visual style overrides.
   * Web: CSSProperties
   * Native: StyleProp<ViewStyle>
   */
  tooltipStyle?: unknown;

  /**
   * Trigger wrapper style.
   * Web: CSSProperties
   * Native: StyleProp<ViewStyle>
   */
  triggerWrapperStyle?: unknown;

  /**
   * Anchor / arrow
   */
  showAnchor?: boolean;
  anchorSize?: number;
  anchorColor?: string;
};
