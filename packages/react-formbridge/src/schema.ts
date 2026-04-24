/**
 * Server-safe export surface for schema authoring and validation helpers.
 *
 * Why this file exists:
 * - the main `@runilib/react-formbridge` entry also exports React hooks and UI helpers
 * - strict server/client runtimes can therefore classify that root entry as
 *   client-only when it is imported from a server module
 * - shared schema files (route handlers, server actions, metadata helpers, etc.)
 *   still need access to `field`, `createSchema`, bridge helpers, and schema types
 *
 * This subpath intentionally re-exports only the non-React pieces so server code can do:
 * `import { field, createSchema } from '@runilib/react-formbridge/schema'`
 * without pulling the client runtime into the module graph.
 */

export {
  type JoiBridgeIssue,
  type JoiBridgeOptions,
  joiBridge,
  type ValibotBridgeIssue,
  type ValibotBridgeOptions,
  valibotBridge,
  type YupBridgeIssue,
  type YupBridgeOptions,
  yupBridge,
  type ZodBridgeIssue,
  type ZodBridgeOptions,
  zodBridge,
} from './core/bridges';
export type {
  BridgeAdapterOptions,
  BridgeErrorMode,
  BridgeIssueContext,
  BridgeIssueMapResult,
  BridgePathInput,
} from './core/bridges/types';
export { field } from './core/field-descriptors/field';
export { inferFromObject, inferFromType } from './core/field-descriptors/infer';
export type { MASK_PRESET } from './core/field-descriptors/mask/constants';
export { MASKS } from './core/field-descriptors/mask/constants';
export type { MaskPatternInput } from './core/field-descriptors/mask/masks';
export type {
  MaskPatternConfig,
  MaskTokenMap,
} from './core/field-descriptors/mask/types';
export type { InferFieldOptions, InferOverrides } from './core/field-descriptors/types';
export {
  createSchema,
  type FormBridgeSchema,
  type FormBridgeSchemaApi,
  FormBridgeSchemaValidationError,
  getSchemaValidationApi,
} from './core/validators/createSchema';
export { ref } from './core/validators/reference';
export type * from './types/schema';
