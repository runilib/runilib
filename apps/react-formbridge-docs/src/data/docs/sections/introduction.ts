import type { LibraryDoc } from '../../../types/index';

export const introductionSection: LibraryDoc['sections'][number] = {
  id: 'fb-overview',
  title: 'Introduction',
  content: `
REACT FORMBRIDGE is a schema-driven form builder and runtime for React and React Native.
Define your form once with a declarative schema. Get type-safe fields, validation, conditional logic, persistence and more on web and native without wiring a single input by hand.`,
  subsections: [
    {
      id: 'fb-overview-motivation',
      title: 'Motivation',
      content: `Building forms in React has always been a trade-off. Low-level libraries give you full control but require tedious, repetitive wiring for every field, every validation rule, every visibility condition. Higher-level solutions exist, but they are web-only, tightly coupled to a UI kit, or force you into a rigid configuration format that breaks down the moment your requirements grow.

When you add React Native to the picture, the gap widens. Teams end up maintaining two codebases for the same form, one for the web, one for mobile with diverging validation logic, duplicated state management, and no shared contract between them.

We are bulding React FormBridge because we believe form logic should be written once and run everywhere your React code runs. The schema you write for a checkout flow on web should power the exact same flow in your native app, with the same validation, the same conditional fields, and the same type safety.`,
    },
    {
      id: 'fb-overview-vision',
      title: 'Vision',
      content: `React FormBridge aspires to be the definitive schema-first form layer for the React ecosystem.

Our north star is a world where teams stop thinking about form infrastructure and start thinking about form intent. You describe *what* your form is(its fields, rules, and behaviors) and the runtime handles the *how*: rendering the right input for the platform, validating at the right moment, persisting drafts, orchestrating multi-step wizards, tracking analytics, and adapting to conditional logic changes in real time.

We want to remove the boundary between web and native form development entirely, so that a single schema becomes the shared contract between designers, front-end engineers, and back-end teams regardless of the platform they ship to.`,
    },
    {
      id: 'fb-overview-why',
      title: 'Why React FormBridge',
      content: `- **Schema as the single source of truth.** Your form's structure, validation, labels, defaults, and conditional logic live in one place. Change the schema and everything follows rendering, types, and behavior.
- **Cross-platform by design.** The same \`useFormBridge()\` hook powers web and React Native. Platform-specific concerns are handled through typed, platform-aware field overrides, not separate codebases.
- **Zero boilerplate.** No provider wrapping, no field registration, no manual \`onChange\`/\`onBlur\` wiring. The runtime generates ready-to-render field components from your schema.
- **Full type safety, end to end.** From builder methods to submitted values, every layer is inferred from the schema. TypeScript catches mismatches at compile time, not at runtime.
- **Bring your own validation.** Built-in rules cover common cases. When you need more, plug in Zod, Yup, Joi, or Valibot through first-class adapters no glue code required.
- **Built for real-world complexity.** Conditional visibility, draft persistence, dynamic forms, wizard flows, async options, analytics, and readonly views are first-class features, not afterthoughts.`,
    },
    {
      id: 'fb-overview-at-a-glance',
      title: 'At a glance',
      content: `- You describe the form once with fluent \`field.*\` builders and keep the schema as the source of truth.
- \`useFormBridge()\` returns a ready-to-use \`Form\`, generated \`fields\`, reactive \`state\`, visibility rules, draft helpers, imperative actions and more.
- The same schema drives rendering, validation, conditional logic, persistence, analytics, and advanced flows such as wizards or dynamic forms.
- No provider, registry, or field-level wiring is required: the builder/runtime takes care of the form lifecycle for you.`,
    },
    {
      id: 'fb-overview-generated-fields-optional',
      title: 'Generated fields are optional',
      content: `The generated \`fields.*\` components are a convenience, not a requirement. You can completely skip them and wire the form to your own native inputs (\`<input>\`, \`<textarea>\`, \`<TextInput>\`, any design-system component) while still getting schema-driven validation, state, conditional logic, and persistence.

Two escape hatches are first-class, built into the runtime:

- [fieldController(name)](/docs/fieldcontroller) returns a field-scoped runtime (\`value\`, \`onChange\`, \`onBlur\`, \`error\`, \`disabled\`, \`visible\`, …) that you bind to any input of your choice. The schema keeps owning validation and state; you keep full control of the markup.
- [field.custom()](/docs/field-custom) declare a schema entry whose renderer is a component you provide. The builder still validates and tracks the value; you render whatever you want inside.

This means FormBridge scales from "zero UI code, use the generated fields" all the way to "render every input by hand", without ever leaving the schema. You pick the level of control per field, not per project.`,
    },
  ],
};
