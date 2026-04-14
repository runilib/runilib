import type { ResolverResult, SchemaValidatorResolver } from '../../types/options';
import type {
  ResolverAdapterOptions,
  ResolverMode,
  ResolverPathInput,
  ResolverValues,
} from './types';
import { collectErrors, failure, success } from './utils';

// ─── Yup ─────────────────────────────────────────────────────────────────────

export interface YupResolverIssue {
  path?: ResolverPathInput;
  message?: string;
}

interface YupValidationError {
  message: string;
  name?: string;
  path?: string;
  inner?: YupResolverIssue[];
  value?: unknown;
}

interface YupSchema {
  validate?: (data: unknown, options?: object) => Promise<unknown>;
  validateSync?: (data: unknown, options?: object) => unknown;
}

export interface YupResolverOptions extends ResolverAdapterOptions<YupResolverIssue> {
  mode?: ResolverMode;
  validateOptions?: Record<string, unknown>;
}

function getYupValidationOptions(options: YupResolverOptions): Record<string, unknown> {
  return {
    abortEarly: false,
    ...options.validateOptions,
  };
}

async function executeYupValidation(
  schema: YupSchema,
  values: ResolverValues,
  options: YupResolverOptions,
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
    '[@runilib/react-formbridge] yupResolver expected a schema exposing validate or validateSync.',
  );
}

function extractYupIssues(error: YupValidationError): YupResolverIssue[] {
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

export function yupResolver(
  schema: YupSchema,
  options: YupResolverOptions = {},
): SchemaValidatorResolver {
  return async (values): Promise<ResolverResult> => {
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
