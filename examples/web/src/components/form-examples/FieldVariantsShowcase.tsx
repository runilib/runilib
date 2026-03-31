import { useState } from 'react';

import { CheckboxVariantsExample } from './CheckboxVariantsExample';
import styles from './FormExamples.module.css';
import { SelectVariantsExample } from './SelectVariantsExample';
import { SwitchVariantsExample } from './SwitchVariantsExample';

const FIELD_VARIANT_TABS = [
  {
    id: 'select',
    label: 'Select',
    note: 'local, radio, async',
    component: SelectVariantsExample,
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    note: 'consents + opt-ins',
    component: CheckboxVariantsExample,
  },
  {
    id: 'switch',
    label: 'Switch',
    note: 'product toggles',
    component: SwitchVariantsExample,
  },
] as const;

type FieldVariantTabId = (typeof FIELD_VARIANT_TABS)[number]['id'];

export function FieldVariantsShowcase() {
  const [activeTab, setActiveTab] = useState<FieldVariantTabId>('select');
  const activeEntry =
    FIELD_VARIANT_TABS.find((item) => item.id === activeTab) ?? FIELD_VARIANT_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <section className={`${styles.sectionCard} ${styles.resolverShowcase}`}>
      <div className={styles.resolverShowcaseHead}>
        <div>
          <span className={styles.resolverEyebrow}>field variants</span>
          <h2 className={styles.resolverTitle}>Select, checkbox, and switch patterns</h2>
          <p className={styles.resolverSubtitle}>
            Compare the main choice-field families in one place. Each tab is isolated in
            its own file so you can inspect the schema, behavior, and UX pattern without
            turning the dashboard into one giant example.
          </p>
        </div>

        <div className={styles.resolverSwitcher}>
          {FIELD_VARIANT_TABS.map((item) => (
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
