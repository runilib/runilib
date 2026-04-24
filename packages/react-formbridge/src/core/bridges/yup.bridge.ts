import type { BridgeResult, SchemaValidatorBridge } from '../../types/options';
import type {
  BridgeAdapterOptions,
  BridgeMode,
  BridgePathInput,
  BridgeValues,
} from './types';
import { collectErrors, failure, success } from './utils';

// ─── Yup ─────────────────────────────────────────────────────────────────────

export interface YupBridgeIssue {
  path?: BridgePathInput;
  message?: string;
}

interface YupValidationError {
  message: string;
  name?: string;
  path?: string;
  inner?: YupBridgeIssue[];
  value?: unknown;
}

interface YupSchema {
  validate?: (data: unknown, options?: object) => Promise<unknown>;
  validateSync?: (data: unknown, options?: object) => unknown;
}

export interface YupBridgeOptions extends BridgeAdapterOptions<YupBridgeIssue> {
  mode?: BridgeMode;
  validateOptions?: Record<string, unknown>;
}

function getYupValidationOptions(options: YupBridgeOptions): Record<string, unknown> {
  return {
    abortEarly: false,
    ...options.validateOptions,
  };
}

async function executeYupValidation(
  schema: YupSchema,
  values: BridgeValues,
  options: YupBridgeOptions,
): Promise<unknown> {
  const validateOptions = getYupValidationOptions(options);

  if (
    (options.mode === 'async' || options.mode === 'auto' || options.mode == null) &&
    typeof schema.validate === 'function'
  ) {
    return schema.validate(values, validateOptions);
  }

  if (typeof schema.validateSync === 'function') {
    return schema.validateSync(values, validateOptions);
  }

  if (typeof schema.validate === 'function') {
    return schema.validate(values, validateOptions);
  }

  throw new Error(
    '[@runilib/react-formbridge] yupBridge expected a schema exposing validate or validateSync.',
  );
}

function extractYupIssues(error: YupValidationError): YupBridgeIssue[] {
  if (Array.isArray(error.inner) && error.inner.length > 0) {
    return error.inner;
  }

  return [
    {
      path: error.path,
      message: error.message,
    },
  ];
}

export function yupBridge(
  schema: YupSchema,
  options: YupBridgeOptions = {},
): SchemaValidatorBridge {
  return async (values): Promise<BridgeResult> => {
    try {
      const data = await executeYupValidation(schema, values, options);
      return success(data, values);
    } catch (error) {
      const yupError = error as YupValidationError;

      if (yupError.name !== 'ValidationError') {
        throw error;
      }

      return failure(
        values,
        collectErrors(
          extractYupIssues(yupError),
          values,
          options,
          (issue) => issue.path,
          (issue) => issue.message,
        ),
      );
    }
  };
}
