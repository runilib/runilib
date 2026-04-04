import { Tooltip } from '@runilib/react-walkit';

export function TooltipAnchorWeb() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Tooltip
        anchor={
          <button
            type="button"
            aria-label="More information"
            style={{ borderRadius: 999, width: 28, height: 28 }}
          >
            ?
          </button>
        }
        openOnHover
        content="This example uses the anchor prop."
      />

      <Tooltip content="This trigger reads tooltip visibility and drives it manually.">
        {({ hide, show, visible }) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: This demo intentionally keeps a lightweight inline span trigger and only attaches hover handlers.
          <span
            onMouseEnter={show}
            onMouseLeave={hide}
            style={{
              cursor: 'help',
              color: visible ? '#2563eb' : '#475569',
              fontWeight: 700,
            }}
          >
            {visible ? 'Tooltip is open' : 'Hover for trigger API'}
          </span>
        )}
      </Tooltip>
    </div>
  );
}
