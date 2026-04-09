import type { CSSProperties } from 'react';

import type {
  FieldReadonlyState,
  ReadonlyFieldProps,
} from '../../hooks/shared/useReadonlyForm';
import { cx, mergeStyles } from './helpers';

interface Props {
  state: FieldReadonlyState;
  showDiff: boolean;
  props?: ReadonlyFieldProps;
}

export const ReadonlyField = ({ state, showDiff, props: extraProps }: Props) => {
  const { label, display, changed, originalDisplay } = state;

  return (
    <div
      data-fb-field="readonly"
      data-fb-name={state.name}
      {...(changed ? { 'data-fb-changed': '' } : {})}
      className={cx(extraProps?.className)}
      style={mergeStyles(extraProps?.style as CSSProperties)}
    >
      <p data-fb-slot="label">{label}</p>

      <div data-fb-slot="value-row">
        <p
          data-fb-slot="value"
          {...(showDiff && changed ? { 'data-fb-changed': '' } : {})}
        >
          {display}
        </p>

        {showDiff && changed && originalDisplay && (
          <p data-fb-slot="original-value">{originalDisplay}</p>
        )}

        {showDiff && changed && <span data-fb-slot="changed-badge">edited</span>}
      </div>
    </div>
  );
};
