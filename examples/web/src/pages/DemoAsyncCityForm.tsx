import React from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

type CityDeps = { country?: string };

export function DemoAsyncCityForm() {
  const schema = React.useMemo(
    () => ({
      country: field
        .select('Country')
        .options([
          { label: 'France', value: 'FR' },
          { label: 'USA', value: 'US' },
        ])
        .required('Country is required'),
      city: field
        .select('City')
        .optionsFrom<CityDeps>(
          async ({
            search,
            deps,
            signal,
          }: {
            search: string;
            deps: CityDeps;
            signal?: AbortSignal;
          }) => {
            const country = String(deps.country ?? '');

            if (!country) {
              return [];
            }

            const response = await fetch(
              `/api/cities?country=${country}&q=${encodeURIComponent(search)}`,
              { signal },
            );

            if (!response.ok) {
              throw new Error('Failed to fetch cities');
            }

            return (await response.json()) as Array<{ label: string; value: string }>;
          },
          {
            key: 'cities',
            dependsOn: ['country'],
            debounce: 400,
            minChars: 2,
            fetchOnMount: false,
            keepPreviousOptions: true,
          },
        )
        .searchable()
        .required('City is required'),
    }),
    [],
  );

  const { Form, fields } = useFormBridge(schema);

  return (
    <Form onSubmit={(values) => console.log('values', values)}>
      <fields.country />
      <fields.city />
      <Form.Submit>Submit</Form.Submit>
    </Form>
  );
}
