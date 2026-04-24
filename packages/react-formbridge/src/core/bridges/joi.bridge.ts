import type { BridgeResult, SchemaValidatorBridge } from '../../types/options';
import type {
  BridgeAdapterOptions,
  BridgeMode,
  BridgePathInput,
  BridgeValues,
} from './types';
import { collectErrors, failure, success } from './utils';

export interface JoiBridgeIssue {
  path?: BridgePathInput;
  message?: string;
}

interface JoiValidationError extends Error {
  isJoi?: boolean;
  details?: JoiBridgeIssue[];
}

interface JoiSchema {
  validate?: (
    data: unknown,
    options?: object,
  ) => {
    error?: JoiValidationError;
    value: unknown;
  };
  validateAsync?: (data: unknown, options?: object) => Promise<unknown>;
}

export interface JoiBridgeOptions extends BridgeAdapterOptions<JoiBridgeIssue> {
  mode?: BridgeMode;
  stripQuotes?: boolean;
  validateOptions?: Record<string, unknown>;
}

function getJoiValidationOptions(options: JoiBridgeOptions): Record<string, unknown> {
  return {
    abortEarly: false,
    allowUnknown: true,
    ...options.validateOptions,
  };
}

function isJoiValidationError(error: unknown): error is JoiValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'details' in error &&
    Array.isArray((error as JoiValidationError).details)
  );
}

async function executeJoiValidation(
  schema: JoiSchema,
  values: BridgeValues,
  options: JoiBridgeOptions,
): Promise<{ error?: JoiValidationError; value: unknown }> {
  const validateOptions = getJoiValidationOptions(options);

  if (
    (options.mode === 'async' || options.mode === 'auto' || options.mode == null) &&
    typeof schema.validateAsync === 'function'
  ) {
    try {
      return {
        value: await schema.validateAsync(values, validateOptions),
      };
    } catch (error) {
      if (isJoiValidationError(error)) {
        return {
          error,
          value: values,
        };
      }

      throw error;
    }
  }

  if (typeof schema.validate === 'function') {
    return schema.validate(values, validateOptions);
  }

  if (typeof schema.validateAsync === 'function') {
    try {
      return {
        value: await schema.validateAsync(values, validateOptions),
      };
    } catch (error) {
      if (isJoiValidationError(error)) {
        return {
          error,
          value: values,
        };
      }

      throw error;
    }
  }

  throw new Error(
    '[@runilib/react-formbridge] joiBridge expected a schema exposing validate or validateAsync.',
  );
}

export function joiBridge(
  schema: JoiSchema,
  options: JoiBridgeOptions = {},
): SchemaValidatorBridge {
  const { normalizeMessage, stripQuotes = true, ...restOptions } = options;

  const mergedOptions: JoiBridgeOptions = {
    ...restOptions,
    stripQuotes,
    normalizeMessage: (message, issue) => {
      const withoutQuotes = stripQuotes ? message.replace(/"/g, '') : message;
      return normalizeMessage ? normalizeMessage(withoutQuotes, issue) : withoutQuotes;
    },
  };

  return async (values): Promise<BridgeResult> => {
    const { error, value } = await executeJoiValidation(schema, values, mergedOptions);

    if (!error) {
      return success(value, values);
    }

    return failure(
      values,
      collectErrors(
        error.details ?? [],
        values,
        mergedOptions,
        (issue) => issue.path,
        (issue) => issue.message,
      ),
    );
  };
}
