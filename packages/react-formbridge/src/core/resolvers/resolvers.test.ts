import { describe, expect, it, vi } from 'vitest';
import { joiResolver, valibotResolver, yupResolver, zodResolver } from '.';
import { FORM_ROOT_ERROR_KEY } from './types';

describe('zodResolver', () => {
  it('aggregates duplicate field errors and keeps root errors', async () => {
    const safeParseAsync = vi.fn().mockResolvedValue({
      success: false,
      error: {
        issues: [
          { path: ['email'], message: 'Invalid email' },
          { path: ['email'], message: 'Email already used' },
          { path: [], message: 'Form is blocked' },
        ],
      },
    });

    const resolver = zodResolver(
      { safeParseAsync },
      {
        errorMode: 'join',
        joinMessagesWith: ' | ',
      },
    );

    await expect(resolver({ email: 'aks@runilib.dev' })).resolves.toEqual({
      values: { email: 'aks@runilib.dev' },
      errors: {
        email: 'Invalid email | Email already used',
        [FORM_ROOT_ERROR_KEY]: 'Form is blocked',
      },
    });
  });

  it('supports sync parsing and returns parsed values', async () => {
    const parseOptions = { reportInput: true };
    const safeParse = vi.fn().mockReturnValue({
      success: true,
      data: { email: 'aks@runilib.dev', age: 31 },
    });

    const resolver = zodResolver(
      { safeParse },
      {
        mode: 'sync',
        parseOptions,
      },
    );

    await expect(resolver({ email: 'AKS@runilib.dev', age: '31' })).resolves.toEqual({
      values: { email: 'aks@runilib.dev', age: 31 },
      errors: {},
    });

    expect(safeParse).toHaveBeenCalledWith(
      { email: 'AKS@runilib.dev', age: '31' },
      parseOptions,
    );
  });
});

describe('yupResolver', () => {
  it('merges validate options and maps root errors', async () => {
    const validationError = Object.assign(new Error('Validation failed'), {
      name: 'ValidationError',
      inner: [
        { path: 'email', message: 'Email is invalid' },
        { path: undefined, message: 'Subscription plan is required' },
      ],
    });
    const validate = vi.fn().mockRejectedValue(validationError);

    const resolver = yupResolver(
      { validate },
      {
        rootKey: 'form',
        validateOptions: { strict: true },
      },
    );

    await expect(resolver({ email: 'aks', plan: '' })).resolves.toEqual({
      values: { email: 'aks', plan: '' },
      errors: {
        email: 'Email is invalid',
        form: 'Subscription plan is required',
      },
    });

    expect(validate).toHaveBeenCalledWith(
      { email: 'aks', plan: '' },
      { abortEarly: false, strict: true },
    );
  });

  it('supports sync validation, custom paths, and last-error mode', async () => {
    const validationError = Object.assign(new Error('Validation failed'), {
      name: 'ValidationError',
      inner: [
        { path: 'billing.address.city', message: 'Missing city' },
        { path: 'billing.address.city', message: 'Still missing city' },
      ],
    });
    const validateSync = vi.fn(() => {
      throw validationError;
    });

    const resolver = yupResolver(
      { validateSync },
      {
        mode: 'sync',
        errorMode: 'last',
        formatPath: (path) => path.map(String).join(' > '),
        mapIssue: ({ defaultMessage }) => ({
          message: `Yup says: ${defaultMessage}`,
        }),
      },
    );

    await expect(resolver({})).resolves.toEqual({
      values: {},
      errors: {
        'billing > address > city': 'Yup says: Still missing city',
      },
    });
  });
});

describe('joiResolver', () => {
  it('supports validateAsync and returns parsed values', async () => {
    const validateAsync = vi.fn().mockResolvedValue({
      age: 31,
      email: 'aks@runilib.dev',
    });

    const resolver = joiResolver(
      { validateAsync },
      {
        validateOptions: { convert: true },
      },
    );

    await expect(resolver({ age: '31', email: 'aks@runilib.dev' })).resolves.toEqual({
      values: { age: 31, email: 'aks@runilib.dev' },
      errors: {},
    });

    expect(validateAsync).toHaveBeenCalledWith(
      { age: '31', email: 'aks@runilib.dev' },
      { abortEarly: false, allowUnknown: true, convert: true },
    );
  });

  it('strips quotes by default and can drop root errors', async () => {
    const validate = vi.fn().mockReturnValue({
      value: { email: 'aks' },
      error: {
        details: [
          { path: ['email'], message: '"email" must be a valid email' },
          { path: [], message: '"form" failed' },
        ],
      },
    });

    const resolver = joiResolver(
      { validate },
      {
        rootKey: null,
      },
    );

    await expect(resolver({ email: 'aks' })).resolves.toEqual({
      values: { email: 'aks' },
      errors: {
        email: 'email must be a valid email',
      },
    });
  });
});

describe('valibotResolver', () => {
  it('uses the provided module and resolves object-based paths', async () => {
    const module = {
      safeParse: vi.fn().mockReturnValue({
        success: false,
        issues: [
          {
            path: [{ key: 'payment' }, { key: 'cards' }, { key: 0 }, { key: 'cvv' }],
            message: 'Invalid CVV',
          },
        ],
      }),
    };

    const resolver = valibotResolver(
      { any: 'schema' },
      {
        module,
        mode: 'sync',
      },
    );

    await expect(resolver({})).resolves.toEqual({
      values: {},
      errors: {
        'payment.cards.0.cvv': 'Invalid CVV',
      },
    });
  });

  it('throws a helpful error when valibot is unavailable', async () => {
    const resolver = valibotResolver({}, { module: undefined, mode: 'sync' });

    await expect(resolver({ email: 'aks@runilib.dev' })).rejects.toThrow(
      'Install it or pass `{ module: v }`',
    );
  });
});
