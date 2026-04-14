import type { LibraryDoc } from './../../../types/index';
import { DOC_PREVIEWS } from '../constants';

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
          preview: DOC_PREVIEWS.resolver,
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
          preview: DOC_PREVIEWS.resolver,
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
          preview: DOC_PREVIEWS.resolver,
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
          preview: DOC_PREVIEWS.resolver,
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
      content: `Remote search belongs in a different lane than validation, but in real products they often meet in the same field.`,
      codeTabs: [
        {
          filename: 'AsyncCity.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.asyncWeb,
          code: `
import { useAsyncOptions } from '@runilib/react-formbridge'

const cityFetcher = async ({ search, deps, signal }) => {
  const res = await fetch('/api/cities?country=' + deps.country + '&q=' + encodeURIComponent(search), { signal })
  const data = await res.json()
  return data.map((city: { id: string; name: string }) => ({ value: city.id, label: city.name }))
}

export function CitySelect({ country }: { country: string }) {
  const cities = useAsyncOptions({
    key: 'cities',
    fetch: cityFetcher,
    dependsOn: ['country'],
    debounce: 250,
    minChars: 2,
    fetchOnMount: false,
    cacheTtl: 5 * 60_000,
  }, { country })
  const canSearch = cities.search.trim().length >= 2

  return (
    <div>
      <input
        placeholder="Type at least 2 characters"
        value={cities.search}
        onChange={(e) => cities.setSearch(e.target.value)}
      />
      {!canSearch ? <p>Type at least 2 characters</p> : null}
      {canSearch && cities.loading ? <p>Loading...</p> : null}
      <ul>{cities.options.map((option) => <li key={option.value}>{option.label}</li>)}</ul>
    </div>
  )
}`,
        },
        {
          filename: 'AsyncCity.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.asyncNative,
          code: `
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAsyncOptions } from '@runilib/react-formbridge'

export function CityPicker({ country }: { country: string }) {
  const cities = useAsyncOptions({
    key: 'cities',
    fetch: async ({ search, deps }) => {
      const res = await fetch('https://example.com/cities?country=' + deps.country + '&q=' + search)
      const data = await res.json()
      return data.map((city: any) => ({ value: city.id, label: city.name }))
    },
    dependsOn: ['country'],
    minChars: 2,
    fetchOnMount: false,
  }, { country })
  const canSearch = cities.search.trim().length >= 2

  return (
    <View style={{ gap: 8 }}>
      <TextInput
        placeholder="Type at least 2 characters"
        value={cities.search}
        onChangeText={cities.setSearch}
      />
      {!canSearch ? <Text>Type at least 2 characters</Text> : null}
      {canSearch && cities.loading ? <Text>Loading…</Text> : null}
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
