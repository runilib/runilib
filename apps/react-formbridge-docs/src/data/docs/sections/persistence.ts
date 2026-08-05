import type { LibraryDoc } from './../../../types/index';
import { PERSIST_OPTIONS_SURFACE } from '../constants';

export const persistenceSection: LibraryDoc['sections'][number] = {
  id: 'fb-persistence',

  title: 'Draft persistence',
  content: `Draft persistence lets a form survive refreshes, tab changes, route changes, or interrupted sessions.

- Great for checkout flows, onboarding, long settings screens, or mobile forms that may be backgrounded
- The runtime restores saved values on mount and exposes helpers to manage that lifecycle
- Built-in targets cover \`local\`, \`session\`, and \`async\`, and you can plug in a custom \`StorageAdapter\` when drafts must go through encrypted, remote, or app-specific storage`,
  codeTabs: [
    {
      filename: 'PersistenceLocalStorage.web.tsx',
      label: 'Local storage',
      interactive: true,
      lang: 'tsx',
      code: `import { useCallback, useEffect, useState } from 'react'
import { field, useFormBridge } from '@runilib/react-formbridge'

const STORAGE_PREFIX = 'react-formbridge:'
const PERSIST_KEY = 'docs:persist:local-profile'
const STORAGE_KEY = STORAGE_PREFIX + PERSIST_KEY
const EMPTY_VALUES = {
  fullName: '',
  email: '',
  notes: '',
  newsletter: true,
  otp: '',
}

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required(),
  notes: field.textarea('Notes').required().min(10, 'Write at least 10 characters.'),
  newsletter: field.checkbox('Email me product updates'),
  otp: field.text('One-time code').placeholder('Excluded from persistence'),
}

function LocalDraftForm({
  onRefreshStorage,
  onRemount,
  onRestore,
  onSubmitted,
}: {
  onRefreshStorage: () => void
  onRemount: () => void
  onRestore: () => void
  onSubmitted: (values: Record<string, unknown>) => void
}) {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    initialValues: {
      newsletter: true,
    },
    persist: {
      key: PERSIST_KEY,
      storage: 'local',
      ttl: 5 * 60,
      debounce: 300,
      exclude: ['otp'],
      version: 'docs-local-v1',
      onRestore: () => {
        onRestore()
        onRefreshStorage()
      },
    },
  })

  const { Form, fieldController, persistanceHelpers, state } = form

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const timer = window.setTimeout(() => {
      onRefreshStorage()
    }, 350)

    return () => window.clearTimeout(timer)
  }, [onRefreshStorage, state.values])

  return (
    <>
      <Form
        onSubmit={async (values) => {
          onSubmitted(values)
        }}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <AppField form={form} name="fullName" />
          <AppField form={form} name="email" />
          <AppField form={form} name="notes" />
          <AppField form={form} name="newsletter" />
          <AppField form={form} name="otp" />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={async () => {
                await persistanceHelpers.saveDraftNow()
                onRefreshStorage()
              }}
            >
              Save draft now
            </button>

            <button
              type="button"
              onClick={async () => {
                await persistanceHelpers.saveDraftNow()
                onRefreshStorage()
                onRemount()
              }}
            >
              Save + remount
            </button>

            <button
              type="button"
              onClick={async () => {
                await persistanceHelpers.clearDraft()
                onRefreshStorage()
              }}
            >
              Clear saved draft
            </button>

            <button
              type="button"
              onClick={() => {
                form.resetFields(EMPTY_VALUES)
              }}
            >
              Reset fields only
            </button>
          </div>

          <button type="submit">Submit values</button>
        </div>
      </Form>

      <div
        style={{
          border: '1px solid #d6d9e0',
          borderRadius: 12,
          padding: 12,
          background: '#fff',
          marginTop: 16,
        }}
      >
        <strong>Runtime snapshot</strong>
        <p style={{ margin: '8px 0', color: '#4b5563', fontSize: 13 }}>
          Loading draft: {String(persistanceHelpers.isLoadingDraft)}
          {' · '}
          Restored on mount: {String(persistanceHelpers.hasDraft)}
        </p>
        <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(state.values, null, 2)}
        </pre>
      </div>
    </>
  )
}

export function PersistenceLocalStoragePlayground() {
  const [instanceId, setInstanceId] = useState(0)
  const [restoreCount, setRestoreCount] = useState(0)
  const [rawDraft, setRawDraft] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)

  const refreshStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    setRawDraft(window.localStorage.getItem(STORAGE_KEY))
  }, [])

  useEffect(() => {
    refreshStorage()
  }, [instanceId, refreshStorage])

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        padding: 20,
        background: '#f5f7fb',
        display: 'grid',
        gap: 16,
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 8px' }}>Interactive localStorage persistence</h3>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Type into the form, click <strong>Save + remount</strong>, and the same
          draft is restored from browser local storage. The OTP field is excluded
          on purpose.
        </p>
      </div>

      <LocalDraftForm
        key={instanceId}
        onRefreshStorage={refreshStorage}
        onRemount={() => setInstanceId((current) => current + 1)}
        onRestore={() => setRestoreCount((current) => current + 1)}
        onSubmitted={setSubmitted}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 12,
        }}
      >
        <div
          style={{
            border: '1px solid #d6d9e0',
            borderRadius: 12,
            padding: 12,
            background: '#fff',
          }}
        >
          <strong>Persist configuration</strong>
          <p style={{ margin: '8px 0', color: '#4b5563', fontSize: 13 }}>
            Key: <code>{STORAGE_KEY}</code>
          </p>
          <p style={{ margin: '8px 0', color: '#4b5563', fontSize: 13 }}>
            TTL: 5 minutes
            {' · '}
            Debounce: 300ms
            {' · '}
            Version: docs-local-v1
          </p>
          <p style={{ margin: 0, color: '#4b5563', fontSize: 13 }}>
            Restores observed in this session: <strong>{restoreCount}</strong>
          </p>
        </div>

        <div
          style={{
            border: '1px solid #d6d9e0',
            borderRadius: 12,
            padding: 12,
            background: '#fff',
          }}
        >
          <strong>Last submit</strong>
          <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #d6d9e0',
          borderRadius: 12,
          padding: 12,
          background: '#fff',
        }}
      >
        <strong>Raw localStorage draft</strong>
        <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {rawDraft ?? 'No saved draft yet.'}
        </pre>
      </div>
    </div>
  )
}`,
    },
    {
      filename: 'PersistenceCustomAdapter.web.tsx',
      label: 'Custom adapter',
      interactive: true,
      lang: 'tsx',
      code: `import { useCallback, useMemo, useRef, useState } from 'react'
import type { StorageAdapter } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const STORAGE_PREFIX = 'react-formbridge:'
const PERSIST_KEY = 'docs:persist:custom-adapter'
const STORAGE_KEY = STORAGE_PREFIX + PERSIST_KEY
const EMPTY_VALUES = {
  company: '',
  role: '',
  handoff: '',
}

const schema = {
  company: field.text('Company').required(),
  role: field
    .select('Role')
    .options(['Designer', 'Engineer', 'Product manager'])
    .required(),
  handoff: field
    .textarea('Handoff note')
    .required()
    .min(10, 'Write at least 10 characters.'),
}

function buildEnvelope(values: Record<string, unknown>) {
  return JSON.stringify({
    values,
    savedAt: Date.now(),
    ttl: 0,
    version: 'docs-custom-v1',
  })
}

function pushNextLog(current: string[], message: string) {
  return [message, ...current].slice(0, 8)
}

function CustomAdapterForm({
  adapter,
  onRemount,
  onRestore,
  onSubmitted,
}: {
  adapter: StorageAdapter
  onRemount: () => void
  onRestore: () => void
  onSubmitted: (values: Record<string, unknown>) => void
}) {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    persist: {
      key: PERSIST_KEY,
      storage: adapter,
      debounce: 250,
      version: 'docs-custom-v1',
      onRestore,
    },
  })

  const { Form, fieldController, persistanceHelpers, state } = form

  return (
    <>
      <Form
        onSubmit={async (values) => {
          onSubmitted(values)
        }}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <AppField form={form} name="company" />
          <AppField form={form} name="role" />
          <AppField form={form} name="handoff" />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={async () => {
                await persistanceHelpers.saveDraftNow()
              }}
            >
              Save draft now
            </button>

            <button
              type="button"
              onClick={async () => {
                await persistanceHelpers.saveDraftNow()
                onRemount()
              }}
            >
              Save + remount
            </button>

            <button
              type="button"
              onClick={async () => {
                await persistanceHelpers.clearDraft()
              }}
            >
              Clear adapter draft
            </button>

            <button
              type="button"
              onClick={() => {
                form.resetFields(EMPTY_VALUES)
              }}
            >
              Reset fields only
            </button>
          </div>

          <button type="submit">Submit values</button>
        </div>
      </Form>

      <div
        style={{
          border: '1px solid #d6d9e0',
          borderRadius: 12,
          padding: 12,
          background: '#fff',
          marginTop: 16,
        }}
      >
        <strong>Runtime snapshot</strong>
        <p style={{ margin: '8px 0', color: '#4b5563', fontSize: 13 }}>
          Restored on mount: {String(persistanceHelpers.hasDraft)}
          {' · '}
          Autosave debounce: 250ms
        </p>
        <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(state.values, null, 2)}
        </pre>
      </div>
    </>
  )
}

export function PersistenceCustomAdapterPlayground() {
  const storeRef = useRef<Record<string, string>>({})
  const [instanceId, setInstanceId] = useState(0)
  const [logs, setLogs] = useState<string[]>(['Adapter ready'])
  const [restoreCount, setRestoreCount] = useState(0)
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)

  const pushLog = useCallback((message: string) => {
    setLogs((current) => pushNextLog(current, message))
  }, [])

  const adapter = useMemo<StorageAdapter>(
    () => ({
      async getItem(key) {
        const value = storeRef.current[key] ?? null
        pushLog('getItem(' + key + ') -> ' + (value ? 'hit' : 'miss'))
        return value
      },
      async setItem(key, value) {
        storeRef.current[key] = value
        pushLog('setItem(' + key + ')')
      },
      async removeItem(key) {
        delete storeRef.current[key]
        pushLog('removeItem(' + key + ')')
      },
    }),
    [pushLog],
  )

  const preloadDraft = useCallback(() => {
    storeRef.current[STORAGE_KEY] = buildEnvelope({
      company: 'Runilib',
      role: 'Engineer',
      handoff: 'Prepared inside the custom adapter before mounting the form.',
    })
    pushLog('Manual preload into adapter store')
    setInstanceId((current) => current + 1)
  }, [pushLog])

  const clearAdapterStore = useCallback(() => {
    storeRef.current = {}
    pushLog('Manual adapter store reset')
    setInstanceId((current) => current + 1)
  }, [pushLog])

  const storedDraft = storeRef.current[STORAGE_KEY] ?? null

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        padding: 20,
        background: '#f5f7fb',
        display: 'grid',
        gap: 16,
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 8px' }}>Interactive custom adapter</h3>
        <p style={{ margin: 0, color: '#4b5563' }}>
          This playground swaps browser storage for a custom adapter. In a real
          app, the same contract can point to IndexedDB, encrypted storage, or a
          remote sync layer.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={preloadDraft}>
          Preload adapter draft
        </button>
        <button type="button" onClick={clearAdapterStore}>
          Reset adapter store
        </button>
        <button type="button" onClick={() => setInstanceId((current) => current + 1)}>
          Remount form only
        </button>
      </div>

      <CustomAdapterForm
        key={instanceId}
        adapter={adapter}
        onRemount={() => setInstanceId((current) => current + 1)}
        onRestore={() => setRestoreCount((current) => current + 1)}
        onSubmitted={setSubmitted}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 12,
        }}
      >
        <div
          style={{
            border: '1px solid #d6d9e0',
            borderRadius: 12,
            padding: 12,
            background: '#fff',
          }}
        >
          <strong>Adapter state</strong>
          <p style={{ margin: '8px 0', color: '#4b5563', fontSize: 13 }}>
            Storage key: <code>{STORAGE_KEY}</code>
          </p>
          <p style={{ margin: 0, color: '#4b5563', fontSize: 13 }}>
            Restore callbacks observed: <strong>{restoreCount}</strong>
          </p>
        </div>

        <div
          style={{
            border: '1px solid #d6d9e0',
            borderRadius: 12,
            padding: 12,
            background: '#fff',
          }}
        >
          <strong>Last submit</strong>
          <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #d6d9e0',
          borderRadius: 12,
          padding: 12,
          background: '#fff',
        }}
      >
        <strong>Current adapter payload</strong>
        <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {storedDraft ?? 'No saved draft in the adapter yet.'}
        </pre>
      </div>

      <div
        style={{
          border: '1px solid #d6d9e0',
          borderRadius: 12,
          padding: 12,
          background: '#fff',
        }}
      >
        <strong>Adapter call log</strong>
        <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {logs.join('\\n')}
        </pre>
      </div>
    </div>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-persistence-notes',
      title: 'When to enable it',
      content: `Use persistence for long or interruption-prone flows. Exclude secrets such as passwords, PINs, OTPs, CVV, or any field you would not want stored locally.

The interactive demos above show two common setups:

- a built-in \`local\` adapter for browser drafts
- a custom \`StorageAdapter\` when the persistence layer is app-specific

${PERSIST_OPTIONS_SURFACE}

Draft helpers exposed through \`useFormBridge()\`:

| Helper | Description |
| --- | --- |
| \`isLoadingDraft\` | \`true\` while the runtime is rehydrating a saved draft on mount |
| \`hasDraft\` | \`true\` once a draft was found and applied for this form key |
| \`saveDraftNow()\` | Force-flush the current values to storage (bypasses debounce) |
| \`clearDraft()\` | Delete the stored draft for this form key |`,
    },
  ],
};
