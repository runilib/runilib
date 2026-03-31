import { useState } from 'react';

import { CssModulesStylingExample } from './CssModulesStylingExample';
import styles from './FormExamples.module.css';
import { SlotOverridesStylingExample } from './SlotOverridesStylingExample';
import { StyledComponentsStylingExample } from './StyledComponentsStylingExample';

const STYLING_TABS = [
  {
    id: 'styled-components',
    label: 'Styled Components',
    note: 'Custom slots + layout',
    component: StyledComponentsStylingExample,
  },
  {
    id: 'css-modules',
    label: 'CSS Modules',
    note: 'Global ui theme',
    component: CssModulesStylingExample,
  },
  {
    id: 'slot-overrides',
    label: 'Slot overrides',
    note: 'No extra library',
    component: SlotOverridesStylingExample,
  },
] as const;

type StylingTabId = (typeof STYLING_TABS)[number]['id'];

export function StylingExamplesShowcase() {
  const [activeTab, setActiveTab] = useState<StylingTabId>('styled-components');
  const activeEntry =
    STYLING_TABS.find((item) => item.id === activeTab) ?? STYLING_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <section className={`${styles.sectionCard} ${styles.resolverShowcase}`}>
      <div className={styles.resolverShowcaseHead}>
        <div>
          <span className={styles.resolverEyebrow}>styling demos</span>
          <h2 className={styles.resolverTitle}>Style the same form in different ways</h2>
          <p className={styles.resolverSubtitle}>
            Switch between three styling recipes: styled-components, a shared CSS Modules
            theme, and pure slot overrides. Each example lives in its own file so the page
            stays readable.
          </p>
        </div>

        <div className={styles.resolverSwitcher}>
          {STYLING_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.resolverSwitch} ${item.id === activeTab ? styles.resolverSwitchActive : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className={styles.resolverSwitchLabel}>{item.label}</span>
              <span className={styles.resolverSwitchNote}>{item.note}</span>
            </button>
          ))}
        </div>
      </div>

      <ActiveExample />
    </section>
  );
}
