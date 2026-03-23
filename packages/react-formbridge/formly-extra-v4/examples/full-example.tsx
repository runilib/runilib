/**
 * formura v1.4 — All 5 new features
 * ──────────────────────────────────────
 * 8.  field.phone() — country picker + masked input
 * 11. FormDevTools — live form state panel
 * 14. i18n — French validation messages
 * 15. Analytics — field timing, abandonment, completion
 * 18. useAsyncOptions — API-driven selects
 */

import React from 'react';
import { useForm, field } from 'formura';
import { PhoneFieldBuilder }    from 'formura';
import { FormDevTools }         from 'formura/devtools';
import { setLocale }            from 'formura';
import { useAsyncOptions }      from 'formura';

// ── 14. Set French locale globally (call once at app init) ────────────────────
setLocale('fr');

// ── Simulated APIs ────────────────────────────────────────────────────────────

const api = {
  getCountries: async () => [
    { label: '🇫🇷 France',         value: 'FR' },
    { label: '🇺🇸 United States',   value: 'US' },
    { label: '🇩🇪 Germany',         value: 'DE' },
    { label: '🇬🇧 United Kingdom',  value: 'UK' },
    { label: '🇸🇳 Senegal',         value: 'SN' },
    { label: '🇨🇮 Côte d\'Ivoire',  value: 'CI' },
  ],
  getCities: async (country?: unknown, search?: string) => {
    const cities: Record<string, string[]> = {
      FR: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'],
      US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
      DE: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
      SN: ['Dakar', 'Touba', 'Thiès', 'Kaolack', 'Ziguinchor'],
    };
    const list = cities[String(country ?? '')] ?? [];
    if (search) return list.filter(c => c.toLowerCase().includes(search.toLowerCase()))
      .map(c => ({ label: c, value: c }));
    return list.map(c => ({ label: c, value: c }));
  },
  checkUsername: async (value: string) => {
    await new Promise(r => setTimeout(r, 400));
    const taken = ['admin', 'root', 'aks', 'user'];
    return taken.includes(value.toLowerCase()) ? 'Ce nom d\'utilisateur est déjà pris.' : null;
  },
};

// ─── Example 1: Complete registration form ────────────────────────────────────

export function RegistrationForm() {
  // ── 15. Analytics ──────────────────────────────────────────────
  const analytics = {
    onFieldFocus:    (name: string) =>
      console.log('[analytics] focus:', name),
    onFieldComplete: (name: string, ms: number) =>
      console.log('[analytics] complete:', name, `${ms}ms`),
    onFieldAbandoned:(name: string) =>
      console.log('[analytics] abandoned:', name),
    onFieldError:    (name: string, err: string) =>
      console.log('[analytics] error:', name, err),
    onFormAbandoned: (pct: number, last: string | null) =>
      console.log('[analytics] form abandoned at', pct + '%', 'last field:', last),
    onFormCompleted: (ms: number, submits: number) =>
      console.log('[analytics] completed in', ms + 'ms', 'after', submits, 'attempts'),
    onFormError:     (errs: Record<string, string>) =>
      console.log('[analytics] submit failed:', Object.keys(errs)),
  };

  // ── 18. Async options for country and city ──────────────────────
  const countryOptions = useAsyncOptions({
    fetch:    () => api.getCountries(),
    cacheTtl: 300_000,  // cache 5 min
  });

  // ── Form definition ─────────────────────────────────────────────
  const form = useForm(
    {
      firstName: field.text('Prénom').required().trim(),
      lastName:  field.text('Nom').required().trim(),
      email:     field.email('Email').required(),

      username:  field.text('Nom d\'utilisateur')
                   .required()
                   .min(3)
                   .max(20)
                   .pattern(/^[a-zA-Z0-9_]+$/, 'Lettres, chiffres et _ uniquement.')
                   .validate(async (v) => api.checkUsername(String(v)))
                   .debounce(400)
                   .hint('Vérifie la disponibilité en temps réel'),

      // ── 8. Phone field with country selector ──────────────────────
      phone: new PhoneFieldBuilder('Téléphone')
                .required()
                .defaultCountry('FR')
                .preferredCountries(['FR', 'SN', 'CI', 'US', 'GB'])
                .searchable()
                .hint('Format local automatiquement selon le pays'),

      // Country select — async from API
      country: field.select('Pays').required(),

      password: field.password('Mot de passe')
                  .required()
                  .withStrengthIndicator({ showRules: true }),

      confirm:  field.password('Confirmer le mot de passe')
                  .required()
                  .matches('password', 'Les mots de passe ne correspondent pas.'),

      terms:    field.checkbox('J\'accepte les Conditions Générales d\'Utilisation')
                  .mustBeTrue(),
    },
    {
      validateOn: 'onTouched',
      analytics:  { callbacks: analytics, exclude: ['password', 'confirm'] },
    }
  );

  const { Form, fields, state } = form;

  // Inject async options into the country field
  React.useEffect(() => {
    if (countryOptions.options.length > 0) {
      // In a real integration, useForm would accept asyncOptions directly
      // Here we show the pattern for manual injection
    }
  }, [countryOptions.options]);

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Créer un compte</h1>
      <p style={{ color: '#6b7280', marginBottom: 28, fontSize: 14 }}>
        Tous les messages d'erreur sont en français via <code>setLocale('fr')</code>
      </p>

      {state.submitError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca',
                      borderRadius: 8, color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
          {state.submitError}
        </div>
      )}

      <Form onSubmit={async (v) => {
        await new Promise(r => setTimeout(r, 1000));
        console.log('Submitted:', v);
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <fields.firstName />
          <fields.lastName />
        </div>

        <fields.email />
        <fields.username />   {/* async validation with debounce */}

        {/* ── 8. Phone field ── */}
        <fields.phone />

        {/* ── 18. Country select with async options ── */}
        <fields.country label="Pays" />
        {countryOptions.loading && (
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: -12 }}>Chargement des pays…</p>
        )}

        <fields.password />
        <fields.confirm />
        <fields.terms />

        <Form.Submit style={submitBtnStyle} loadingText="Création du compte…">
          Créer le compte →
        </Form.Submit>
      </Form>

      {/* ── 11. DevTools — shown only in development ── */}
      {process.env.NODE_ENV === 'development' && (
        <FormDevTools
          form={form}
          position="bottom-right"
          title="Registration"
          accentColor="#6366f1"
        />
      )}
    </div>
  );
}

// ─── Example 2: Searchable async city select ──────────────────────────────────

export function CitySearchForm() {
  const { Form, fields, watch } = useForm({
    country: field.select('Pays').options([
      { label: '🇫🇷 France',  value: 'FR' },
      { label: '🇺🇸 USA',     value: 'US' },
      { label: '🇸🇳 Sénégal', value: 'SN' },
    ]).required(),
    city:    field.select('Ville').required(),
  });

  const selectedCountry = watch('country');

  // ── 18. City options depend on selected country ────────────────
  const cityOptions = useAsyncOptions(
    {
      fetch:     async (search, deps) => api.getCities(deps?.country, search),
      dependsOn: ['country'],
      debounce:  300,
      minChars:  0,
      cacheTtl:  60_000,
      initialOptions: [],
      fetchOnMount: false,
    },
    { country: selectedCountry },
  );

  return (
    <div style={{ maxWidth: 360, margin: '0 auto', padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h2>Sélection ville</h2>
      <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 20 }}>
        Les villes se chargent selon le pays choisi.
      </p>
      <Form onSubmit={(v) => console.log('Selected:', v)}>
        <fields.country />

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            Ville *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={String(watch('city') ?? '')}
              onChange={e => (fields.city as any)?.props?.onChange(e)}
              disabled={cityOptions.loading || !selectedCountry}
              style={{ width: '100%', padding: '10px 13px', borderRadius: 8,
                       border: '1.5px solid #e5e7eb', fontSize: 14 }}
            >
              <option value="">
                {cityOptions.loading ? 'Chargement…' :
                 !selectedCountry ? 'Choisissez d\'abord un pays' :
                 'Sélectionnez une ville'}
              </option>
              {cityOptions.options.map(o => (
                <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
              ))}
            </select>
          </div>
          {cityOptions.error && (
            <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{cityOptions.error}</p>
          )}
        </div>

        <Form.Submit style={submitBtnStyle}>Confirmer</Form.Submit>
      </Form>
    </div>
  );
}

// ─── Example 3: Analytics dashboard (demo only) ───────────────────────────────

export function AnalyticsDashboard() {
  const [events, setEvents] = React.useState<string[]>([]);

  const push = (msg: string) =>
    setEvents(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);

  const { Form, fields } = useForm(
    {
      name:  field.text('Name').required(),
      email: field.email('Email').required(),
    },
    {
      analytics: {
        callbacks: {
          onFieldFocus:    (n)      => push(`👁 focus: ${n}`),
          onFieldComplete: (n, ms)  => push(`✅ complete: ${n} (${ms}ms)`),
          onFieldAbandoned:(n)      => push(`🚶 abandoned: ${n}`),
          onFieldError:    (n, err) => push(`❌ error: ${n} — ${err}`),
          onFormCompleted: (ms)     => push(`🎉 form completed in ${ms}ms`),
          onFormError:     (errs)   => push(`⚠️ submit failed: ${Object.keys(errs).join(', ')}`),
        },
      },
    }
  );

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h2>Analytics demo</h2>
      <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 20 }}>
        Interact with the form — events appear in the log below.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Form onSubmit={(v) => console.log(v)}>
          <fields.name />
          <fields.email />
          <Form.Submit style={submitBtnStyle}>Submit</Form.Submit>
        </Form>
        <div style={{ background: '#1a1a2e', borderRadius: 10, padding: 14, overflow: 'hidden' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', marginBottom: 8, letterSpacing: '0.08em' }}>
            EVENT LOG
          </p>
          <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {events.length === 0
              ? <p style={{ fontSize: 12, color: '#4b5563' }}>Interact with the form…</p>
              : events.map((e, i) => (
                  <p key={i} style={{ fontSize: 11, color: '#e5e7eb', fontFamily: 'monospace', margin: 0 }}>{e}</p>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const submitBtnStyle: React.CSSProperties = {
  width: '100%', marginTop: 12, padding: '13px 0',
  background: '#6366f1', color: '#fff', border: 'none',
  borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
};
