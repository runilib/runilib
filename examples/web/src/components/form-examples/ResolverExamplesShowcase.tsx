import { useState } from 'react';

import styles from './FormExamples.module.css';
import { JoiResolverExample } from './JoiResolverExample';
import { SchemaRefinementExample } from './SchemaRefinementExample';
import { ValibotResolverExample } from './ValibotResolverExample';
import { YupResolverExample } from './YupResolverExample';
import { ZodResolverExample } from './ZodResolverExample';

const RESOLVER_TABS = [
  {
    id: 'built-in',
    label: 'Built-in',
    note: 'No resolver',
    component: SchemaRefinementExample,
  },
  {
    id: 'zod',
    label: 'Zod',
    note: 'Typed parsing',
    component: ZodResolverExample,
  },
  {
    id: 'yup',
    label: 'Yup',
    note: 'Chainable rules',
    component: YupResolverExample,
  },
  {
    id: 'joi',
    label: 'Joi',
    note: 'Strict business rules',
    component: JoiResolverExample,
  },
  {
    id: 'valibot',
    label: 'Valibot',
    note: 'Composable pipelines',
    component: ValibotResolverExample,
  },
] as const;

type ResolverTabId = (typeof RESOLVER_TABS)[number]['id'];

export function ResolverExamplesShowcase() {
  const [activeTab, setActiveTab] = useState<ResolverTabId>('built-in');
  const activeEntry =
    RESOLVER_TABS.find((item) => item.id === activeTab) ?? RESOLVER_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <section className={`${styles.sectionCard} ${styles.resolverShowcase}`}>
      <div className={styles.resolverShowcaseHead}>
        <div>
          <span className={styles.resolverEyebrow}>resolver demos</span>
          <h2 className={styles.resolverTitle}>Schema adapters in action</h2>
          <p className={styles.resolverSubtitle}>
            Switch between real forms wired to Zod, Yup, Joi, and Valibot. Each demo is
            isolated in its own file so the page stays readable while still showing the
            full integration.
          </p>
        </div>

        <div className={styles.resolverSwitcher}>
          {RESOLVER_TABS.map((item) => (
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
