import { Tooltip } from '@runilib/react-walkit';

const chipStyle = {
  padding: '10px 14px',
  borderRadius: 12,
  border: '1px solid #cbd5e1',
  background: '#fff',
  cursor: 'pointer',
};

export function TooltipPlacementsWeb() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 98,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
      }}
    >
      <div />
      <Tooltip
        placement="top"
        offset={12}
        openOnHover
        content="Placement: top"
      >
        <button
          type="button"
          style={chipStyle}
        >
          Tooltip Top
        </button>
      </Tooltip>
      <div />

      <Tooltip
        placement="left"
        openOnHover
        content="Placement: left"
      >
        <button
          type="button"
          style={chipStyle}
        >
          Tooltip Left
        </button>
      </Tooltip>

      <Tooltip
        placement="auto"
        openOnHover
        content="Placement: auto"
      >
        <button
          type="button"
          style={chipStyle}
        >
          Tooltip Auto
        </button>
      </Tooltip>

      <Tooltip
        placement="right"
        openOnHover
        content="Placement: right"
      >
        <button
          type="button"
          style={chipStyle}
        >
          Tooltip Right
        </button>
      </Tooltip>

      <div />
      <Tooltip
        placement="bottom"
        openOnHover
        content="Placement: bottom"
      >
        <button
          type="button"
          style={chipStyle}
        >
          Tooltip Bottom
        </button>
      </Tooltip>
      <div />
    </div>
  );
}
