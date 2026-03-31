import type {
  AsyncDependencyShape,
  AsyncOptionsConfig,
  OptionsFetcher,
} from '../../../hooks/shared/useAsyncOptions';
import type { FieldType, SelectOption, Validator } from '../../../types';
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

export class SelectFieldBuilder extends BaseFieldBuilder<string> {
  constructor(type: FieldType, label: string) {
    super(type, label, '');
  }

  options(options: SelectOption[] | string[]): this {
    const normalizedOptions = options.map((option) =>
      typeof option === 'string' ? { label: option, value: option } : option,
    );

    this._desc._options = normalizedOptions;

    this._desc._validators = this._desc._validators.filter(
      (validator) => !isOptionsValidator(validator),
    );

    const optionsValidator = tagOptionsValidator<string>((value: string) => {
      if (isEmptyValue(value)) {
        return null;
      }

      return normalizedOptions.some((option) => option.value === value)
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
