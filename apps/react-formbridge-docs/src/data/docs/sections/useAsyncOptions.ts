import type { LibraryDoc } from './../../../types/index';
import {
  ASYNC_OPTIONS_CONFIG_SURFACE,
  ASYNC_OPTIONS_FETCHER_SURFACE,
  DOC_PREVIEWS,
} from '../constants';

export const useAsyncOptionsSection: LibraryDoc['sections'][number] = {
  id: 'fb-use-async-options',

  title: 'useAsyncOptions()',
  content: `Standalone hook for remote option lists.

- Use it directly when you want to build your own async autocomplete or picker UI
- Use it indirectly through \`field.select().optionsFrom(...)\` when a generated field is enough
- The hook handles debounce, caching, cancellation, dependency keys, and refreshes for you`,
  codeTabs: [
    {
      filename: 'AsyncCity.web.tsx',
      lang: 'tsx',
      preview: DOC_PREVIEWS.asyncWeb,
      code: `import { field, useAsyncOptions } from '@runilib/react-formbridge'

const cityFetcher = async ({ search, deps, signal }) => {
  const res = await fetch('/api/cities?country=' + deps.country + '&q=' + encodeURIComponent(search), { signal })
  const data = await res.json()
  return data.map((city: { id: string; name: string }) => ({ value: city.id, label: city.name }))
}

export function CitySelect({ country }: { country: string }) {
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
    <div>
      <input
        placeholder="Type at least 2 characters"
        value={asyncCity.search}
        onChange={(e) => asyncCity.setSearch(e.target.value)}
      />
      {!canSearch ? <p>Type at least 2 characters</p> : null}
      {canSearch && asyncCity.loading ? <p>Loading...</p> : null}
      {asyncCity.error ? <p>{asyncCity.error}</p> : null}
      <ul>
        {asyncCity.options.map((opt) => (
          <li key={opt.value}>{opt.label}</li>
        ))}
      </ul>
    </div>
  )
}`,
    },
    {
      filename: 'AsyncSelect.native.tsx',
      lang: 'tsx',
      preview: DOC_PREVIEWS.asyncNative,
      code: `import { useAsyncOptions } from '@runilib/react-formbridge'
import { FlatList, TextInput, TouchableOpacity, Text, View } from 'react-native'

export function CityPickerNative({ country }: { country: string }) {
  const cities = useAsyncOptions({
    key: 'cities',
    fetch: async ({ search, deps }) => {
      const res = await fetch('https://example.com/cities?country=' + deps.country + '&q=' + search)
      const data = await res.json()
      return data.map((c: any) => ({ value: c.id, label: c.name }))
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
      content: `Complete return surface:
- \`options: SelectOption[]\`
- \`loading: boolean\`
- \`error: string | null\`
- \`search: string\`
- \`setSearch(next: string)\`
- \`clearSearch()\`
- \`refresh()\` — clears the current cache entry and refetches`,
    },
  ],
};
