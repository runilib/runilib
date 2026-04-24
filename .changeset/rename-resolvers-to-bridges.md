---
'@runilib/react-formbridge': patch
---

**Breaking:** Schema adapters renamed from `*Resolver` to `*Bridge` to align with the library's identity.

### Renamed public API

| Before | After |
| --- | --- |
| `zodResolver`, `yupResolver`, `joiResolver`, `valibotResolver` | `zodBridge`, `yupBridge`, `joiBridge`, `valibotBridge` |
| `ZodResolverOptions`, `YupResolverOptions`, `JoiResolverOptions`, `ValibotResolverOptions` | `ZodBridgeOptions`, `YupBridgeOptions`, `JoiBridgeOptions`, `ValibotBridgeOptions` |
| `ZodResolverIssue`, `YupResolverIssue`, `JoiResolverIssue`, `ValibotResolverIssue` | `ZodBridgeIssue`, `YupBridgeIssue`, `JoiBridgeIssue`, `ValibotBridgeIssue` |
| `ResolverAdapterOptions`, `ResolverErrorMode`, `ResolverIssueContext`, `ResolverIssueMapResult`, `ResolverPathInput` | `BridgeAdapterOptions`, `BridgeErrorMode`, `BridgeIssueContext`, `BridgeIssueMapResult`, `BridgePathInput` |
| `SchemaValidatorResolver` | `SchemaValidatorBridge` |
| `ResolverResult` | `BridgeResult` |
| `useFormBridge(schema, { resolver })` prop | `useFormBridge(schema, { validatorBridge })` prop |

### Migration

```diff
- import { zodResolver } from '@runilib/react-formbridge';
+ import { zodBridge } from '@runilib/react-formbridge';

- const resolver = zodResolver(schema);
+ const bridge = zodBridge(schema);

  useFormBridge(schema, {
-   resolver,
+   validatorBridge: bridge,
  });
```

No aliases are kept. Update imports and the `validatorBridge` prop name at call sites.
