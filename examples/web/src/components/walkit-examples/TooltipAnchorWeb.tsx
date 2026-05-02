import { Tooltip } from '@runilib/react-walkit';

export function TooltipAnchorWeb() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
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

      <Tooltip
        id="billing-policy-tooltip"
        ariaLabel="Billing policy help"
        ariaDescribedBy="always"
        closeOnEscape
        openOnPress
        interactive
        renderContent={({ hide }) => (
          <div
            style={{
              maxWidth: 260,
              borderRadius: 12,
              background: '#111827',
              color: '#f8fafc',
              padding: '12px 14px',
              boxShadow: '0 18px 40px rgba(15,23,42,0.28)',
            }}
          >
            <p style={{ margin: 0, fontWeight: 800 }}>Accessible billing help</p>
            <p style={{ margin: '6px 0 10px', lineHeight: 1.45 }}>
              This text is linked to the trigger with aria-describedby and can be
              dismissed with Escape.
            </p>
            <button
              type="button"
              onClick={hide}
              style={{
                border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 8,
                background: 'transparent',
                color: '#f8fafc',
                padding: '6px 10px',
              }}
            >
              Close
            </button>
          </div>
        )}
      >
        <button
          type="button"
          style={{
            borderRadius: 999,
            border: '1px solid #bfdbfe',
            background: '#eff6ff',
            color: '#1d4ed8',
            padding: '8px 12px',
            fontWeight: 800,
          }}
        >
          Accessible tooltip
        </button>
      </Tooltip>
    </div>
  );
}
