import type { CSSProperties } from 'react';

import type {
  FieldReadonlyState,
  ReadonlyFieldProps,
} from '../../hooks/shared/useReadonlyFormBridge';

interface Props {
  state: FieldReadonlyState;
  showDiff: boolean;
  props?: ReadonlyFieldProps;
}

export const WebReadonlyField = ({ state, showDiff, props: extraProps }: Props) => {
  const { label, display, changed, originalDisplay } = state;

  return (
    <div
      className={extraProps?.className}
      style={{
        marginBottom: 16,
        ...(extraProps?.style as CSSProperties),
      }}
    >
      {/* Label */}
      <p style={labelStyle}>{label}</p>

      {/* Value area */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        {/* Current value */}
        <p
          style={{
            ...valueStyle,
            ...(showDiff && changed ? changedStyle : {}),
          }}
        >
          {display}
        </p>

        {/* Diff: original value (strikethrough) */}
        {showDiff && changed && originalDisplay && (
          <p style={originalStyle}>{originalDisplay}</p>
        )}

        {/* Changed badge */}
        {showDiff && changed && <span style={badgeStyle}>edited</span>}
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 4,
};

const valueStyle: CSSProperties = {
  fontSize: 15,
  color: '#111',
  lineHeight: '1.5',
};

const changedStyle: CSSProperties = {
  color: '#0f172a',
  fontWeight: 600,
};

const originalStyle: CSSProperties = {
  fontSize: 13,
  color: '#9ca3af',
  textDecoration: 'line-through',
};

const badgeStyle: CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  backgroundColor: 'rgba(234, 179, 8, 0.12)',
  color: '#ca8a04',
  border: '1px solid rgba(234, 179, 8, 0.25)',
  borderRadius: 4,
  padding: '2px 7px',
};
