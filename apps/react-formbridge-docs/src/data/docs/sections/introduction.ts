import type { LibraryDoc } from '../../../types/index';

export const introductionSection: LibraryDoc['sections'][number] = {
  id: 'fb-overview',
  title: 'Introduction',
  content: `
REACT FORMBRIDGE is a schema-driven, headless form runtime for React and React Native.
Define your form logic once with a declarative schema, then connect it to native inputs or to your own design system. FormBridge owns typed state, validation, conditional logic, persistence and advanced flows; your application owns every visual decision.`,
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

Our north star is a world where teams stop rebuilding form infrastructure and start thinking about form intent. You describe *what* your form is (its fields, rules, and behaviors) and the runtime handles state, validation, persistence, multi-step wizards, analytics, and conditional logic.

Rendering deliberately stays in your application. A single schema can be shared by web and native while each platform uses the markup, components, accessibility primitives, and styling system that fit it best.`,
    },
    {
      id: 'fb-overview-why',
      title: 'Why React FormBridge',
      content: `- **Schema as the single source of truth.** Your form's structure, validation, labels, defaults, and conditional logic live in one place.
- **Cross-platform by design.** The same schema and \`useFormBridge()\` contract power web and React Native, while rendering remains platform-specific.
- **Headless by design.** Bind \`fieldController(name)\` to native inputs, design-system controls, or your own reusable field components.
- **Full type safety, end to end.** From builder methods to submitted values, every layer is inferred from the schema. TypeScript catches mismatches at compile time, not at runtime.
- **Bring your own validation.** Built-in rules cover common cases. When you need more, plug in Zod, Yup, Joi, or Valibot through first-class adapters no glue code required.
- **Built for real-world complexity.** Conditional visibility, draft persistence, dynamic forms, wizard flows, async options, analytics, and readonly views are first-class features, not afterthoughts.`,
    },
    {
      id: 'fb-overview-at-a-glance',
      title: 'At a glance',
      content: `- Describe the form with fluent \`field.*\` builders.
- \`useFormBridge()\` returns typed field controllers, reactive state, visibility rules, draft helpers, submit helpers, and imperative actions.
- Bind a controller's \`value\`, \`onChange\`, \`onBlur\`, \`onFocus\`, \`disabled\`, \`required\`, and \`error\` to your components.
- The same schema drives validation, conditional logic, persistence, analytics, wizards, and dynamic forms.`,
    },
    {
      id: 'fb-overview-headless',
      title: 'What “headless” means',
      content: `FormBridge does not select or generate inputs. [fieldController(name)](/docs/fieldcontroller) returns the field-scoped runtime (\`value\`, \`onChange\`, \`onBlur\`, \`error\`, \`disabled\`, \`visible\`, and type-specific metadata) that you bind to any input.

The schema owns form behavior. Your components own HTML or native markup, accessibility, styling, layout, and interaction patterns. This keeps the runtime independent from UI kits and makes the same schema reusable across platforms.`,
    },
    {
      id: 'fb-overview-app-field-examples',
      title: 'About AppField in the examples',
      content: `Some longer examples use an \`<AppField form={form} name="email" />\` component to keep the sample focused on the feature being explained. \`AppField\` is **not exported by React FormBridge**. It represents an application-owned adapter built on \`form.fieldController(name)\`; the [Render your UI](/docs/render-your-ui) guide shows the underlying binding pattern.`,
    },
  ],
};
