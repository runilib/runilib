/**
 * Tests for draft persistence — DraftManager
 */
import { DraftManager } from '../src/persist/draft';

// ─── Mock storage adapter ─────────────────────────────────────────────────────

function makeMemoryAdapter() {
  const store: Record<string, string> = {};
  return {
    store,
    adapter: {
      getItem:    async (k: string) => store[k] ?? null,
      setItem:    async (k: string, v: string) => { store[k] = v; },
      removeItem: async (k: string) => { delete store[k]; },
    },
  };
}

function makeDraft(extra: Partial<ConstructorParameters<typeof DraftManager>[0]> = {}) {
  const { adapter, store } = makeMemoryAdapter();
  const mgr = new DraftManager({
    key:     'test-form',
    storage: adapter,
    ttl:     3600,
    debounce: 0,     // disable debounce in tests
    ...extra,
  });
  return { mgr, store };
}

async function flushTimers() {
  await new Promise(r => setTimeout(r, 10));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftManager — save & load', () => {
  it('returns null when nothing is saved', async () => {
    const { mgr } = makeDraft();
    const result = await mgr.load();
    expect(result).toBeNull();
  });

  it('saves and loads values', async () => {
    const { mgr } = makeDraft();
    mgr.save({ name: 'AKS', email: 'aks@unikit.dev' });
    await flushTimers();
    const loaded = await mgr.load();
    expect(loaded).toEqual({ name: 'AKS', email: 'aks@unikit.dev' });
  });

  it('hasRestoredDraft is false before load', () => {
    const { mgr } = makeDraft();
    expect(mgr.hasRestoredDraft).toBe(false);
  });

  it('hasRestoredDraft is true after successful load', async () => {
    const { mgr } = makeDraft();
    mgr.save({ name: 'AKS' });
    await flushTimers();
    await mgr.load();
    expect(mgr.hasRestoredDraft).toBe(true);
  });

  it('saveNow saves immediately without debounce', async () => {
    const { mgr } = makeDraft({ debounce: 5000 });
    await mgr.saveNow({ name: 'Immediate' });
    const loaded = await mgr.load();
    expect(loaded?.name).toBe('Immediate');
  });
});

describe('DraftManager — exclude', () => {
  it('excludes specified fields from the saved draft', async () => {
    const { mgr } = makeDraft({ exclude: ['password', 'confirm'] });
    mgr.save({ email: 'test@test.com', password: 'secret', confirm: 'secret' });
    await flushTimers();
    const loaded = await mgr.load();
    expect(loaded?.email).toBe('test@test.com');
    expect(loaded?.password).toBeUndefined();
    expect(loaded?.confirm).toBeUndefined();
  });

  it('excludes ALL listed fields', async () => {
    const { mgr } = makeDraft({ exclude: ['cvv', 'ssn', 'pin'] });
    mgr.save({ name: 'AKS', cvv: '123', ssn: '12345', pin: '9999' });
    await flushTimers();
    const loaded = await mgr.load();
    expect(loaded?.name).toBe('AKS');
    expect(Object.keys(loaded ?? {})).not.toContain('cvv');
    expect(Object.keys(loaded ?? {})).not.toContain('ssn');
    expect(Object.keys(loaded ?? {})).not.toContain('pin');
  });
});

describe('DraftManager — TTL', () => {
  it('discards draft when TTL has expired', async () => {
    const { adapter, store } = makeMemoryAdapter();
    // Manually write an expired draft
    const expired = {
      values:  { name: 'Old' },
      savedAt: Date.now() - (2 * 3600 * 1000), // 2 hours ago
      ttl:     3600,
      version: '1',
    };
    store['formura:ttl-test'] = JSON.stringify(expired);

    const mgr = new DraftManager({ key: 'ttl-test', storage: adapter, ttl: 3600, debounce: 0 });
    const loaded = await mgr.load();
    expect(loaded).toBeNull();
  });

  it('loads draft within TTL', async () => {
    const { mgr } = makeDraft({ ttl: 3600 });
    mgr.save({ name: 'Fresh' });
    await flushTimers();
    const loaded = await mgr.load();
    expect(loaded?.name).toBe('Fresh');
  });

  it('ttl = 0 means no expiry', async () => {
    const { adapter, store } = makeMemoryAdapter();
    const ancient = {
      values:  { name: 'Ancient' },
      savedAt: Date.now() - (30 * 24 * 3600 * 1000), // 30 days ago
      ttl:     0,
      version: '1',
    };
    store['formura:no-expiry'] = JSON.stringify(ancient);

    const mgr = new DraftManager({ key: 'no-expiry', storage: adapter, ttl: 0, debounce: 0 });
    const loaded = await mgr.load();
    expect(loaded?.name).toBe('Ancient');
  });
});

describe('DraftManager — version', () => {
  it('discards draft when version mismatches', async () => {
    const { adapter, store } = makeMemoryAdapter();
    const v1 = {
      values:  { name: 'Old schema v1' },
      savedAt: Date.now(),
      ttl:     3600,
      version: '1',
    };
    store['formura:versioned'] = JSON.stringify(v1);

    const mgr = new DraftManager({
      key: 'versioned', storage: adapter,
      ttl: 3600, debounce: 0, version: '2',
    });
    const loaded = await mgr.load();
    expect(loaded).toBeNull();
  });

  it('loads draft when version matches', async () => {
    const { mgr } = makeDraft({ version: 'v2' });
    mgr.save({ data: 'schema v2' });
    await flushTimers();
    const loaded = await mgr.load();
    expect(loaded?.data).toBe('schema v2');
  });
});

describe('DraftManager — clear', () => {
  it('clear removes the draft', async () => {
    const { mgr } = makeDraft();
    mgr.save({ name: 'AKS' });
    await flushTimers();
    await mgr.clear();
    const loaded = await mgr.load();
    expect(loaded).toBeNull();
  });
});

describe('DraftManager — callbacks', () => {
  it('calls onRestore when draft is loaded', async () => {
    const onRestore = jest.fn();
    const { mgr } = makeDraft({ onRestore });
    mgr.save({ name: 'AKS' });
    await flushTimers();
    await mgr.load();
    expect(onRestore).toHaveBeenCalledWith({ name: 'AKS' });
  });

  it('does not call onRestore when nothing is saved', async () => {
    const onRestore = jest.fn();
    const { mgr } = makeDraft({ onRestore });
    await mgr.load();
    expect(onRestore).not.toHaveBeenCalled();
  });

  it('calls onSaveError when storage fails', async () => {
    const onSaveError = jest.fn();
    const badAdapter = {
      getItem:    async () => null,
      setItem:    async () => { throw new Error('QuotaExceeded'); },
      removeItem: async () => {},
    };
    const mgr = new DraftManager({
      key: 'bad', storage: badAdapter,
      ttl: 3600, debounce: 0, onSaveError,
    });
    mgr.save({ x: 1 });
    await flushTimers();
    expect(onSaveError).toHaveBeenCalled();
  });
});
