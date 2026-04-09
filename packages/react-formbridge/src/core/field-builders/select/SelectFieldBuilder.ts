import type {
  AsyncDependencyShape,
  AsyncOptionsConfig,
  OptionsFetcher,
} from '../../../hooks/shared/useAsyncOptions';
import type { SelectOption, Validator } from '../../../types/field';
import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

const OPTIONS_VALIDATOR_TAG = Symbol('options-validator');

type TaggedValidator<V> = Validator<V> & {
  [OPTIONS_VALIDATOR_TAG]?: true;
};

function tagOptionsValidator<V>(validator: Validator<V>): TaggedValidator<V> {
  const tagged = validator as TaggedValidator<V>;
  tagged[OPTIONS_VALIDATOR_TAG] = true;
  return tagged;
}

function isOptionsValidator<V>(validator: Validator<V>): validator is TaggedValidator<V> {
  return Boolean((validator as TaggedValidator<V>)[OPTIONS_VALIDATOR_TAG]);
}

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function normalizeSelectValue(
  value: SelectOption | SelectOption['value'] | '' | null | undefined,
): SelectOption['value'] | '' {
  if (value === '' || value == null) {
    return '';
  }

  return typeof value === 'object' ? value.value : value;
}

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
