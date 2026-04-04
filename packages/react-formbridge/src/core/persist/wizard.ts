import type { PersistOptions } from './draft';
import { resolveAdapter } from './storage';

interface WizardStateEnvelope {
  currentStepId: string | null;
  completedStepIds: string[];
  values: Record<string, unknown>;
  savedAt: number;
  ttl: number;
  version: string;
}

export interface WizardStateSnapshot {
  currentStepId: string | null;
  completedStepIds: string[];
  values: Record<string, unknown>;
}

const PREFIX = 'react-formbridge:';
const WIZARD_STATE_SUFFIX = ':__wizard__';

export class WizardStateManager {
  private readonly adapter;
  private readonly storageKey: string;
  private readonly ttl: number;
  private readonly version: string;

  constructor(opts: Pick<PersistOptions, 'key' | 'storage' | 'ttl' | 'version'>) {
    this.adapter = resolveAdapter(opts.storage ?? 'local');
    this.storageKey = `${PREFIX}${opts.key}${WIZARD_STATE_SUFFIX}`;
    this.ttl = opts.ttl ?? 3600;
    this.version = opts.version ?? '1';
  }

  async load(): Promise<WizardStateSnapshot | null> {
    try {
      const raw = await this.adapter.getItem(this.storageKey);

      if (!raw) {
        return null;
      }

      const envelope = JSON.parse(raw) as WizardStateEnvelope;

      if (envelope.version !== this.version) {
        await this.clear();
        return null;
      }

      if (envelope.ttl > 0) {
        const ageMs = Date.now() - envelope.savedAt;
        const ttlMs = envelope.ttl * 1000;

        if (ageMs > ttlMs) {
          await this.clear();
          return null;
        }
      }

      return {
        currentStepId: envelope.currentStepId,
        completedStepIds: envelope.completedStepIds,
        values: envelope.values,
      };
    } catch {
      return null;
    }
  }

  async save(snapshot: WizardStateSnapshot): Promise<void> {
    const envelope: WizardStateEnvelope = {
      ...snapshot,
      savedAt: Date.now(),
      ttl: this.ttl,
      version: this.version,
    };

    try {
      await this.adapter.setItem(this.storageKey, JSON.stringify(envelope));
    } catch {
      // noop
    }
  }

  async clear(): Promise<void> {
    try {
      await this.adapter.removeItem(this.storageKey);
    } catch {
      // noop
    }
  }
}
