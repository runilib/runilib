import type {
  AsyncDependencyShape,
  AsyncOptionsConfig,
  OptionsFetcher,
} from '../../../hooks/shared/useAsyncOptions';
import type { SelectOption } from '../../../types/field';
import { BaseFieldBuilder } from '../base/BaseFieldBuilder';
import {
  isEmptyValue,
  isOptionsValidator,
  normalizeSelectValue,
  tagOptionsValidator,
} from '../common-utils';

export class SelectFieldBuilder<
  TType extends 'select' | 'radio' = 'select' | 'radio',
> extends BaseFieldBuilder<SelectOption['value'] | '', TType> {
  constructor(type: TType) {
    super(type, '');
  }

  defaultValue(value: SelectOption | SelectOption['value'] | ''): this {
    this._desc._defaultValue = normalizeSelectValue(value);
    return this;
  }

  defaultSelected(value: SelectOption | SelectOption['value']): this {
    return this.defaultValue(value);
  }

  selected(value: SelectOption | SelectOption['value']): this {
    return this.defaultValue(value);
  }

  options(options: SelectOption[] | string[]): this {
    const normalizedOptions = options.map((option) =>
      typeof option === 'string' ? { label: option, value: option } : option,
    );

    this._desc._options = normalizedOptions;

    this._desc._validators = this._desc._validators.filter(
      (validator) => !isOptionsValidator(validator),
    );

    const optionsValidator = tagOptionsValidator<SelectOption['value'] | ''>((value) => {
      if (isEmptyValue(value)) {
        return null;
      }

      return normalizedOptions.some(
        (option) => String(option.value) === String(normalizeSelectValue(value)),
      )
        ? null
        : 'Please select a valid option.';
    });

    this._desc._validators.push(optionsValidator);

    return this;
  }

  oneOf(values: Array<SelectOption | SelectOption['value']>, message?: string): this {
    const allowed = new Set(values.map((value) => String(normalizeSelectValue(value))));

    return this.validate((value) =>
      allowed.has(String(normalizeSelectValue(value)))
        ? null
        : (message ?? 'Please select an allowed option.'),
    );
  }

  notOneOf(values: Array<SelectOption | SelectOption['value']>, message?: string): this {
    const blocked = new Set(values.map((value) => String(normalizeSelectValue(value))));

    return this.validate((value) =>
      blocked.has(String(normalizeSelectValue(value)))
        ? (message ?? 'Please choose a different option.')
        : null,
    );
  }

  disallowPlaceholder(message?: string): this {
    return this.required(message ?? 'Please select an option.');
  }

  optionsFrom<TDeps extends AsyncDependencyShape>(
    fetcher: OptionsFetcher<TDeps>,
    config: Omit<AsyncOptionsConfig<TDeps>, 'fetch'> = {},
  ): this {
    this._desc._asyncOptions = {
      fetch: fetcher,
      ...config,
    } as AsyncOptionsConfig<Record<string, unknown>>;

    return this;
  }

  searchable(value = true): this {
    this._desc._searchable = value;
    return this;
  }
}
