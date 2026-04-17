import type { LibraryDoc } from './../../../types/index';

export const tutorialValidationSection: LibraryDoc['sections'][number] = {
  id: 'fb-tutorial-validation',
  title: 'Tutorial: validation & resolvers',
  content: `Validation is usually a mix of fast local UX rules and one stronger source of truth for business constraints.

- Start with fluent builder rules when the rule clearly belongs to one field
- Add conditional required or visibility rules in the schema instead of scattering conditions through JSX
- Use a resolver when Zod, Yup, Joi, or Valibot already owns the canonical validation contract
- Use async options when a field depends on remote search or lookup data`,
  subsections: [
    {
      id: 'fb-tutorial-validation-builder-rules',
      title: 'Builder rules and cross-field logic',
      content: `This is the fastest path for forms whose rules live mostly in the frontend or belong to one field at a time.`,
      code: {
        filename: 'ValidationRules.tsx',
        lang: 'tsx',
        code: `const schema = {
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  confirmPassword: field
    .password('Confirm password')
    .required()
    .sameAs('password', 'Passwords must match'),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
}

const form = useFormBridge(schema, {
  validateOn: 'onBlur',
  revalidateOn: 'onChange',
})`,
      },
    },
    {
      id: 'fb-tutorial-validation-adapters',
      title: 'Schema adapters',
      content: `Use a resolver when the backend or another package already shares a validation schema with the frontend.`,
      codeTabs: [
        {
          filename: 'zod-resolver.ts',
          lang: 'ts',
          code: `import { z } from 'zod'
import { field, useFormBridge, zodResolver } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

const zodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useFormBridge(schema, {
  resolver: zodResolver(zodSchema),
})`,
        },
        {
          filename: 'yup-resolver.ts',
          lang: 'ts',
          code: `import * as yup from 'yup'
import { field, useFormBridge, yupResolver } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  age: field.number('Age').required(),
}

const yupSchema = yup.object({
  fullName: yup.string().min(2).required(),
  age: yup.number().min(18).required(),
})

const form = useFormBridge(schema, {
  resolver: yupResolver(yupSchema),
})`,
        },
        {
          filename: 'joi-resolver.ts',
          lang: 'ts',
          code: `import Joi from 'joi'
import { field, joiResolver, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  seats: field.number('Seats').required(),
}

const joiSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  seats: Joi.number().min(1).max(500).required(),
})

const form = useFormBridge(schema, {
  resolver: joiResolver(joiSchema),
})`,
        },
        {
          filename: 'valibot-resolver.ts',
          lang: 'ts',
          code: `
import * as v from 'valibot'
import { field, useFormBridge, valibotResolver } from '@runilib/react-formbridge'

const schema = {
  handle: field.text('Handle').required(),
  email: field.email('Email').required(),
}

const valibotSchema = v.object({
  handle: v.pipe(v.string(), v.minLength(3)),
  email: v.pipe(v.string(), v.email()),
})

const form = useFormBridge(schema, {
  resolver: valibotResolver(valibotSchema),
})`,
        },
      ],
    },
    {
      id: 'fb-tutorial-validation-async',
      title: 'Async lookups and remote options',
      content: `Remote search belongs in a different lane than validation, but in real products they often meet in the same field.

- The interactive examples below use mocked city data so the playground behaves like a real lookup flow without depending on an unavailable demo API`,
      codeTabs: [
        {
          filename: 'AsyncCity.web.tsx',
          lang: 'tsx',
          code: `
import { useState } from 'react'
import { useAsyncOptions } from '@runilib/react-formbridge'

const CITY_DB = {
  FR: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'],
  US: ['New York', 'San Francisco', 'Chicago', 'Seattle', 'Austin'],
  GB: ['London', 'Manchester', 'Bristol', 'Leeds', 'Edinburgh'],
}

const cityFetcher = async ({ search, deps, signal }) => {
  await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, 450)

    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })

  const allCities = CITY_DB[deps.country] ?? []
  const normalized = search.trim().toLowerCase()

  return allCities
    .filter((city) => city.toLowerCase().includes(normalized))
    .map((city) => ({
      value: city.toLowerCase().replace(/\\s+/g, '-'),
      label: city,
    }))
}

export function CitySelect() {
  const [country, setCountry] = useState('FR')

  const cities = useAsyncOptions({
    key: 'cities',
    fetch: cityFetcher,
    dependsOn: ['country'],
    debounce: 250,
    minChars: 2,
    fetchOnMount: false,
    cacheTtl: 5 * 60_000,
    keepPreviousOptions: true,
  }, { country })

  const canSearch = cities.search.trim().length >= 2
  const loadingLabel = canSearch && cities.loading
    ? cities.options.length > 0
      ? 'Refreshing results...'
      : 'Loading...'
    : null

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, background: '#f5f7fb' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {['FR', 'US', 'GB'].map((nextCountry) => (
          <button
            key={nextCountry}
            type="button"
            onClick={() => setCountry(nextCountry)}
            style={{ fontWeight: country === nextCountry ? 700 : 500 }}
          >
            {nextCountry}
          </button>
        ))}
      </div>

      <p style={{ marginTop: 0, color: '#4b5563' }}>
        Country: <strong>{country}</strong>
      </p>

      <input
        placeholder="Type at least 2 characters"
        value={cities.search}
        onChange={(e) => cities.setSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid #cbd5e1',
          marginBottom: 12,
        }}
      />
      {!canSearch ? <p>Type at least 2 characters</p> : null}
      {loadingLabel ? <p>{loadingLabel}</p> : null}
      {cities.error ? <p>{cities.error}</p> : null}
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {cities.options.map((option) => (
          <li key={option.value}>{option.label}</li>
        ))}
      </ul>
    </div>
  )
}`,
        },
        {
          filename: 'AsyncCity.native.tsx',
          lang: 'tsx',
          code: `
import { useState } from 'react'
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAsyncOptions } from '@runilib/react-formbridge'

const CITY_DB = {
  FR: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'],
  US: ['New York', 'San Francisco', 'Chicago', 'Seattle', 'Austin'],
  GB: ['London', 'Manchester', 'Bristol', 'Leeds', 'Edinburgh'],
}

export function CityPicker() {
  const [country, setCountry] = useState('FR')

  const cities = useAsyncOptions({
    key: 'cities-tutorial',
    fetch: async ({ search, deps, signal }) => {
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, 450)

        signal.addEventListener(
          'abort',
          () => {
            clearTimeout(timeoutId)
            reject(new Error('aborted'))
          },
          { once: true },
        )
      })

      return (CITY_DB[deps.country] ?? [])
        .filter((city) => city.toLowerCase().includes(search.trim().toLowerCase()))
        .map((city) => ({
          value: city.toLowerCase().replace(/\\s+/g, '-'),
          label: city,
        }))
    },
    dependsOn: ['country'],
    debounce: 250,
    minChars: 2,
    fetchOnMount: false,
    keepPreviousOptions: true,
  }, { country })

  const canSearch = cities.search.trim().length >= 2
  const loadingLabel = canSearch && cities.loading
    ? cities.options.length > 0
      ? 'Refreshing results...'
      : 'Loading...'
    : null

  return (
    <View style={{ gap: 8, padding: 16 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['FR', 'US', 'GB'].map((nextCountry) => (
          <TouchableOpacity key={nextCountry} onPress={() => setCountry(nextCountry)}>
            <Text>{country === nextCountry ? '[' + nextCountry + ']' : nextCountry}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text>Country: {country}</Text>
      <TextInput
        placeholder="Type at least 2 characters"
        value={cities.search}
        onChangeText={cities.setSearch}
      />
      {!canSearch ? <Text>Type at least 2 characters</Text> : null}
      {loadingLabel ? <Text>{loadingLabel}</Text> : null}
      {cities.error ? <Text>{cities.error}</Text> : null}
      <FlatList
        data={cities.options}
        keyExtractor={(item) => String(item.value)}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Text>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}`,
        },
      ],
    },
  ],
};
