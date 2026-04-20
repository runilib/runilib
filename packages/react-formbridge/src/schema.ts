/**
 * Server-safe export surface for schema authoring and validation helpers.
 *
 * Why this file exists:
 * - the main `@runilib/react-formbridge` entry also exports React hooks and UI helpers
 * - strict server/client runtimes can therefore classify that root entry as
 *   client-only when it is imported from a server module
 * - shared schema files (route handlers, server actions, metadata helpers, etc.)
 *   still need access to `field`, `createSchema`, resolver helpers, and schema types
 *
 * This subpath intentionally re-exports only the non-React pieces so server code can do:
 * `import { field, createSchema } from '@runilib/react-formbridge/schema'`
 * without pulling the client runtime into the module graph.
 */
export { field } from './core/field-builders/field';
export { inferFromObject, inferFromType } from './core/field-builders/infer';
export type { MASK_PRESET } from './core/field-builders/mask/constants';
export { MASKS } from './core/field-builders/mask/constants';
export type { MaskPatternInput } from './core/field-builders/mask/masks';
export type {
  MaskPatternConfig,
  MaskTokenMap,
} from './core/field-builders/mask/types';
export type { InferFieldOptions, InferOverrides } from './core/field-builders/types';
export {
  type JoiResolverIssue,
  type JoiResolverOptions,
  joiResolver,
  type ValibotResolverIssue,
  type ValibotResolverOptions,
  valibotResolver,
  type YupResolverIssue,
  type YupResolverOptions,
  yupResolver,
  type ZodResolverIssue,
  type ZodResolverOptions,
  zodResolver,
} from './core/resolvers';
export type {
  ResolverAdapterOptions,
  ResolverErrorMode,
  ResolverIssueContext,
  ResolverIssueMapResult,
  ResolverPathInput,
} from './core/resolvers/types';
export {
  createSchema,
  type FormBridgeSchema,
  type FormBridgeSchemaApi,
  FormBridgeSchemaValidationError,
  getSchemaValidationApi,
} from './core/validators/createSchema';
export { ref } from './core/validators/reference';
export type * from './types/schema';
