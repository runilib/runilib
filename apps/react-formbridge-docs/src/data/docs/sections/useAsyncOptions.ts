import type { LibraryDoc } from './../../../types/index';
import {
  ASYNC_OPTIONS_CONFIG_SURFACE,
  ASYNC_OPTIONS_FETCHER_SURFACE,
  ASYNC_OPTIONS_RETURN_SURFACE,
} from '../constants';

export const useAsyncOptionsSection: LibraryDoc['sections'][number] = {
  id: 'fb-use-async-options',

  title: 'useAsyncOptions()',
  content: `Experimental low-level hook for remote option lists.

- In v1, prefer \`field.select().optionsFrom(...)\` as the stable public path for async option loading
- Use \`useAsyncOptions()\` directly only when you need a fully custom async autocomplete or picker UI
- The hook handles debounce, caching, cancellation, dependency keys, and refreshes for you
- Because it is experimental, the low-level contract may still evolve before it is treated as stable`,
  codeTabs: [
    {
      filename: 'AsyncCityPlayground.web.tsx',
      lang: 'tsx',
      code: `import { useState } from 'react'
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

export function AsyncCityPlayground() {
  const [country, setCountry] = useState('FR')

  const asyncCity = useAsyncOptions({
    key: 'cities',
    fetch: cityFetcher,
    dependsOn: ['country'],
    cacheTtl: 5 * 60_000,
    debounce: 250,
    minChars: 2,
    fetchOnMount: false,
    keepPreviousOptions: true,
  }, { country })

  const canSearch = asyncCity.search.trim().length >= 2

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, background: '#f5f7fb' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {['FR', 'US', 'GB'].map((nextCountry) => (
          <button
            key={nextCountry}
            type="button"
            onClick={() => setCountry(nextCountry)}
            style={{
              fontWeight: country === nextCountry ? 700 : 500,
            }}
          >
            {nextCountry}
          </button>
        ))}
        <button type="button" onClick={() => asyncCity.refresh()}>
          Refresh
        </button>
      </div>

      <p style={{ marginTop: 0, color: '#4b5563' }}>
        Country: <strong>{country}</strong>
      </p>

      <input
        placeholder="Type at least 2 characters"
        value={asyncCity.search}
        onChange={(e) => asyncCity.setSearch(e.target.value)}
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
      {canSearch && asyncCity.loading ? <p>Loading...</p> : null}
      {asyncCity.error ? <p>{asyncCity.error}</p> : null}
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {asyncCity.options.map((opt) => (
          <li key={opt.value}>{opt.label}</li>
        ))}
      </ul>
    </div>
  )
}`,
    },
    {
      filename: 'AsyncSelectPlayground.native.tsx',
      lang: 'tsx',
      code: `import { useState } from 'react'
import { useAsyncOptions } from '@runilib/react-formbridge'
import { FlatList, TextInput, TouchableOpacity, Text, View } from 'react-native'

const CITY_DB = {
  FR: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'],
  US: ['New York', 'San Francisco', 'Chicago', 'Seattle', 'Austin'],
  GB: ['London', 'Manchester', 'Bristol', 'Leeds', 'Edinburgh'],
}

export function AsyncSelectPlayground() {
  const [country, setCountry] = useState('FR')

  const cities = useAsyncOptions({
    key: 'cities',
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
        .map((city) => ({ value: city.toLowerCase(), label: city }))
    },
    dependsOn: ['country'],
    minChars: 2,
    fetchOnMount: false,
  }, { country })

  const canSearch = cities.search.trim().length >= 2

  return (
    <View style={{ gap: 8, padding: 16 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['FR', 'US', 'GB'].map((nextCountry) => (
          <TouchableOpacity key={nextCountry} onPress={() => setCountry(nextCountry)}>
            <Text>{country === nextCountry ? '[' + nextCountry + ']' : nextCountry}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
          <TouchableOpacity><Text>{item.label}</Text></TouchableOpacity>
        )}
      />
    </View>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-async-config',
      title: 'Config',
      content: `${ASYNC_OPTIONS_CONFIG_SURFACE}

${ASYNC_OPTIONS_FETCHER_SURFACE}

\`key + search + deps\` compose the internal cache key.`,
    },
    {
      id: 'fb-async-return',
      title: 'Return',
      content: ASYNC_OPTIONS_RETURN_SURFACE,
    },
  ],
};
