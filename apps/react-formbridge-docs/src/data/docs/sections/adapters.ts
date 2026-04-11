import type { LibraryDoc } from './../../../types/index';
import {
  DOC_PREVIEWS,
  RESOLVER_LIBRARY_OPTIONS_SURFACE,
  RESOLVER_SHARED_OPTIONS_SURFACE,
} from '../constants';

export const adaptersSection: LibraryDoc['sections'][number] = {
  id: 'fb-adapters',

  title: 'Schema adapters (zod, yup, joi, valibot)',
  content: `Use the \`resolver\` option when your real validation source of truth already lives in Zod, Yup, Valibot, Joi, or another schema library.

- The schema builders still drive rendering and UX metadata
- The external schema owns the final values/errors decision
- Successful parsed/coerced values are now forwarded to submit handlers
- This is often the cleanest path in domains that already share validation with the backend`,
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
  name: field.text('Full name').required(),
  age: field.number('Age').required(),
}

const yupSchema = yup.object({
  name: yup.string().min(2).required(),
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
  age: field.number('Age').required().min(18),
}

const joiSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  age: Joi.number().min(18).required(),
})

const form = useFormBridge(schema, {
  resolver: joiResolver(joiSchema),
})`,
    },
    {
      filename: 'valibot-resolver.ts',
      lang: 'ts',
      preview: DOC_PREVIEWS.resolver,
      code: `import * as v from 'valibot'
import {
  field,
  useFormBridge,
  valibotResolver,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

const valibotSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
})

const form = useFormBridge(schema, {
  resolver: valibotResolver(valibotSchema),
})`,
    },
  ],
  subsections: [
    {
      id: 'fb-adapter-options',
      title: 'Shared customization options',
      content: `All four built-in adapters share the same customization surface, so you can keep the same mental model even if the schema library changes later.

${RESOLVER_SHARED_OPTIONS_SURFACE}`,
      code: {
        filename: 'resolver-options.ts',
        lang: 'ts',
        preview: DOC_PREVIEWS.resolver,
        code: `import { field, joiResolver, useFormBridge } from '@runilib/react-formbridge'
import Joi from 'joi'

const schema = {
  email: field.email('Email').required(),
  plan: field.select('Plan').required(),
}

const joiSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  plan: Joi.string().required(),
})

const form = useFormBridge(schema, {
  resolver: joiResolver(joiSchema, {
    rootKey: 'form',
    errorMode: 'join',
    joinMessagesWith: ' · ',
    formatPath: (path) => path.map(String).join('.'),
    normalizeMessage: (message) => message.trim(),
    mapIssue: ({ defaultMessage, defaultPathKey }) => {
      if (defaultPathKey === 'plan') {
        return { message: \`Billing: \${defaultMessage}\` }
      }

      return undefined
    },
  }),
})`,
      },
    },
    {
      id: 'fb-adapter-library-options',
      title: 'Library-specific options',
      content: `Each adapter also exposes the options you usually need from its schema engine.

${RESOLVER_LIBRARY_OPTIONS_SURFACE}

\`mode\` accepts \`'auto'\`, \`'sync'\`, or \`'async'\`. The default \`'auto'\` picks the async method when available, then falls back to sync. For Valibot, pass \`module: v\` if you want to avoid relying on runtime \`require()\`, especially in stricter ESM/browser setups.`,
    },
    {
      id: 'fb-adapter-tips',
      title: 'Tips',
      content: `- The resolver must return \`{ values, errors }\`
- The built-in adapters already handle this contract for you; customize them before writing a custom resolver from scratch
- Root errors default to \`'_root'\`, which is useful for banner-level or submit-level failures
- A resolver works with the same \`useFormBridge()\` API on web and native
- Prefer resolvers when business validation already exists elsewhere; prefer builder rules when the validation belongs to the field itself
- \`valibotResolver\` expects \`valibot\` to be installed in the consumer app, or passed explicitly via \`module: v\``,
    },
  ],
};
