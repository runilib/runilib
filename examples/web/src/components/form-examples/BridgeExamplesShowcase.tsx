import { useState } from 'react';

import styles from './FormExamples.module.css';
import { JoiBridgeExample } from './JoiBridgeExample';
import { SchemaRefinementExample } from './SchemaRefinementExample';
import { ValibotBridgeExample } from './ValibotBridgeExample';
import { YupBridgeExample } from './YupBridgeExample';
import { ZodBridgeExample } from './ZodBridgeExample';

const BRIDGE_TABS = [
  {
    id: 'built-in',
    label: 'Built-in',
    note: 'No bridge',
    component: SchemaRefinementExample,
  },
  {
    id: 'zod',
    label: 'Zod',
    note: 'Typed parsing',
    component: ZodBridgeExample,
  },
  {
    id: 'yup',
    label: 'Yup',
    note: 'Chainable rules',
    component: YupBridgeExample,
  },
  {
    id: 'joi',
    label: 'Joi',
    note: 'Strict business rules',
    component: JoiBridgeExample,
  },
  {
    id: 'valibot',
    label: 'Valibot',
    note: 'Composable pipelines',
    component: ValibotBridgeExample,
  },
] as const;

type BridgeTabId = (typeof BRIDGE_TABS)[number]['id'];

export function BridgeExamplesShowcase() {
  const [activeTab, setActiveTab] = useState<BridgeTabId>('built-in');
  const activeEntry = BRIDGE_TABS.find((item) => item.id === activeTab) ?? BRIDGE_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <section className={`${styles.sectionCard} ${styles.resolverShowcase}`}>
      <div className={styles.resolverShowcaseHead}>
        <div>
          <span className={styles.resolverEyebrow}>bridge demos</span>
          <h2 className={styles.resolverTitle}>Schema adapters in action</h2>
          <p className={styles.resolverSubtitle}>
            Switch between real forms wired to Zod, Yup, Joi, and Valibot. Each demo is
            isolated in its own file so the page stays readable while still showing the
            full integration.
          </p>
        </div>

        <div className={styles.resolverSwitcher}>
          {BRIDGE_TABS.map((item) => (
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
