import { useState } from 'react';

import { AdaptiveMaskBehaviorExample } from './AdaptiveMaskBehaviorExample';
import { CustomRenderedMaskExample } from './CustomRenderedMaskExample';
import { EmployeeBadgeMaskExample } from './EmployeeBadgeMaskExample';
import styles from './FormExamples.module.css';
import { LicensePlateMaskExample } from './LicensePlateMaskExample';

const MASK_TABS = [
  {
    id: 'custom-render',
    label: 'Custom render',
    note: '100% custom UI',
    component: CustomRenderedMaskExample,
  },
  {
    id: 'adaptive',
    label: 'Adaptive behavior',
    note: 'width + token-aware input',
    component: AdaptiveMaskBehaviorExample,
  },
  {
    id: 'plate',
    label: 'License plate',
    note: 'Custom separators',
    component: LicensePlateMaskExample,
  },
  {
    id: 'badge',
    label: 'Employee badge',
    note: 'Fixed prefix format',
    component: EmployeeBadgeMaskExample,
  },
] as const;

type MaskTabId = (typeof MASK_TABS)[number]['id'];

export function CustomMaskExamplesShowcase() {
  const [activeTab, setActiveTab] = useState<MaskTabId>('custom-render');
  const activeEntry = MASK_TABS.find((item) => item.id === activeTab) ?? MASK_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <section className={`${styles.sectionCard} ${styles.resolverShowcase}`}>
      <div className={styles.resolverShowcaseHead}>
        <div>
          <span className={styles.resolverEyebrow}>custom masks</span>
          <h2 className={styles.resolverTitle}>Business identifiers in action</h2>
          <p className={styles.resolverSubtitle}>
            Start with a fully custom-rendered masked field to see how far you can bend
            the UI, then compare it with the built-in adaptive behavior and a couple of
            business-specific formats like plates and badges. The goal is to make the
            trade-off obvious at a glance.
          </p>
        </div>

        <div className={styles.resolverSwitcher}>
          {MASK_TABS.map((item) => (
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
