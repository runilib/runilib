import { useState } from 'react';

import { EmployeeBadgeMaskExample } from './EmployeeBadgeMaskExample';
import styles from './FormExamples.module.css';
import { LicensePlateMaskExample } from './LicensePlateMaskExample';

const MASK_TABS = [
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
  const [activeTab, setActiveTab] = useState<MaskTabId>('plate');
  const activeEntry = MASK_TABS.find((item) => item.id === activeTab) ?? MASK_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <section className={`${styles.sectionCard} ${styles.resolverShowcase}`}>
      <div className={styles.resolverShowcaseHead}>
        <div>
          <span className={styles.resolverEyebrow}>custom masks</span>
          <h2 className={styles.resolverTitle}>Business identifiers in action</h2>
          <p className={styles.resolverSubtitle}>
            Beyond card numbers and expiry dates, custom masks are useful for any product
            code your team owns: plates, badges, warehouse slots, CRM references, and
            other structured IDs. The formatted value is preserved by default, separators
            included.
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
