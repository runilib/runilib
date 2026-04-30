import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Tooltip } from '../components/tooltip/tooltip.web';

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

beforeAll(() => {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterEach(() => {
  document.getElementById('__react_walkit_tooltip_portal__')?.remove();
});

describe('Tooltip accessibility on web', () => {
  it('uses a stable id and links the trigger while visible', () => {
    render(
      <Tooltip
        id="billing-help"
        content="This appears on your invoice."
        openOnPress
      >
        ?
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: '?' });

    expect(trigger.getAttribute('aria-describedby')).toBeNull();

    fireEvent.click(trigger);

    const tooltip = screen.getByRole('tooltip');

    expect(tooltip.getAttribute('id')).toBe('billing-help');
    expect(trigger.getAttribute('aria-describedby')).toBe('billing-help');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('can keep aria-describedby wired before the tooltip opens', () => {
    render(
      <Tooltip
        id="persistent-help"
        content="Persistent description"
        ariaDescribedBy="always"
      >
        <button type="button">Help</button>
      </Tooltip>,
    );

    const triggerWrapper = screen.getByText('Help').closest('span');

    expect(triggerWrapper?.getAttribute('aria-describedby')).toBe('persistent-help');
    expect(document.getElementById('persistent-help')?.textContent).toBe(
      'Persistent description',
    );
  });

  it('closes with Escape even when focus is outside the trigger', () => {
    render(
      <Tooltip
        id="escape-help"
        content="Dismiss me"
        openOnPress
      >
        ?
      </Tooltip>,
    );

    fireEvent.click(screen.getByRole('button', { name: '?' }));
    expect(screen.getByRole('tooltip')).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('honors closeOnEscape=false', () => {
    render(
      <Tooltip
        id="sticky-help"
        content="Stay visible"
        openOnPress
        closeOnEscape={false}
      >
        ?
      </Tooltip>,
    );

    fireEvent.click(screen.getByRole('button', { name: '?' }));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.getByRole('tooltip')).toBeTruthy();
  });

  it('uses dialog semantics for interactive tooltip content', () => {
    render(
      <Tooltip
        id="interactive-help"
        ariaLabel="Interactive help"
        interactive
        openOnPress
        renderContent={() => <button type="button">Learn more</button>}
      >
        ?
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: '?' });
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe(
      'Interactive help',
    );
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });
});
