import type { ReactNode } from 'react';

export type TooltipPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right';

export type TooltipContentApi = {
  toggle: () => void;
  hide: () => void;
  show: () => void;
  visible: boolean;
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
