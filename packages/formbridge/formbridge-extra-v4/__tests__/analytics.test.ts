import { FormAnalyticsTracker } from '../src/analytics/analytics';

function makeTracker(callbacks = {}) {
  return new FormAnalyticsTracker({ callbacks, formId: 'test' });
}

describe('FormAnalyticsTracker — field events', () => {
  it('calls onFieldFocus on focus', () => {
    const onFieldFocus = jest.fn();
    const t = makeTracker({ onFieldFocus });
    t.onFieldFocus('email');
    expect(onFieldFocus).toHaveBeenCalledWith('email');
  });

  it('does NOT call onFieldFocus for excluded fields', () => {
    const onFieldFocus = jest.fn();
    const t = makeTracker({ onFieldFocus });
    t.onFieldFocus('password');
    t.onFieldFocus('cvv');
    expect(onFieldFocus).not.toHaveBeenCalled();
  });

  it('calls onFieldComplete when field has value on blur', async () => {
    const onFieldComplete = jest.fn();
    const t = makeTracker({ onFieldComplete });
    t.onFieldFocus('email');
    await new Promise(r => setTimeout(r, 10));
    t.onFieldBlur('email', 'aks@unikit.dev');
    expect(onFieldComplete).toHaveBeenCalledWith('email', expect.any(Number));
    const [, duration] = onFieldComplete.mock.calls[0];
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  it('calls onFieldAbandoned when field is blurred with empty value after focus', () => {
    const onFieldAbandoned = jest.fn();
    const t = makeTracker({ onFieldAbandoned });
    t.onFieldFocus('email');
    t.onFieldBlur('email', '');
    expect(onFieldAbandoned).toHaveBeenCalledWith('email', '');
  });

  it('does NOT call onFieldAbandoned when field was never focused', () => {
    const onFieldAbandoned = jest.fn();
    const t = makeTracker({ onFieldAbandoned });
    t.onFieldBlur('email', '');   // blurred without focus
    expect(onFieldAbandoned).not.toHaveBeenCalled();
  });

  it('calls onFieldError on error', () => {
    const onFieldError = jest.fn();
    const t = makeTracker({ onFieldError });
    t.onFieldError('email', 'Invalid email.');
    expect(onFieldError).toHaveBeenCalledWith('email', 'Invalid email.');
  });

  it('does NOT call onFieldError for excluded fields', () => {
    const onFieldError = jest.fn();
    const t = makeTracker({ onFieldError });
    t.onFieldError('password', 'Too weak.');
    expect(onFieldError).not.toHaveBeenCalled();
  });

  it('calls onFieldChange on change', () => {
    const onFieldChange = jest.fn();
    const t = makeTracker({ onFieldChange });
    t.onFieldChange('email');
    t.onFieldChange('email');
    expect(onFieldChange).toHaveBeenCalledTimes(2);
    expect(onFieldChange).toHaveBeenLastCalledWith('email', 2);
  });

  it('tracks cumulative change count per field', () => {
    const onFieldChange = jest.fn();
    const t = makeTracker({ onFieldChange });
    t.onFieldChange('name');
    t.onFieldChange('name');
    t.onFieldChange('name');
    expect(onFieldChange.mock.calls.map(([, n]) => n)).toEqual([1, 2, 3]);
  });
});

describe('FormAnalyticsTracker — form events', () => {
  it('calls onFormError on submission failure', () => {
    const onFormError = jest.fn();
    const t = makeTracker({ onFormError });
    t.onFormSubmitError({ email: 'Required.', name: 'Required.' }, 1);
    expect(onFormError).toHaveBeenCalledWith(
      { email: 'Required.', name: 'Required.' }, 1
    );
  });

  it('filters excluded fields from submit errors', () => {
    const onFormError = jest.fn();
    const t = makeTracker({ onFormError });
    t.onFormSubmitError({ email: 'Required.', password: 'Too weak.' }, 1);
    const errors = onFormError.mock.calls[0][0];
    expect(errors.email).toBe('Required.');
    expect(errors.password).toBeUndefined();
  });

  it('calls onFormCompleted on success', () => {
    const onFormCompleted = jest.fn();
    const t = makeTracker({ onFormCompleted });
    t.onFormSubmitSuccess(1, 5);
    expect(onFormCompleted).toHaveBeenCalledWith(
      expect.any(Number), 1, 5
    );
    const [duration] = onFormCompleted.mock.calls[0];
    expect(duration).toBeGreaterThanOrEqual(0);
  });
});

describe('FormAnalyticsTracker — completion', () => {
  it('returns 0 for empty form', () => {
    const t = makeTracker();
    expect(t.computeCompletion({ a: '', b: null, c: undefined })).toBe(0);
  });

  it('returns 100 for fully filled form', () => {
    const t = makeTracker();
    expect(t.computeCompletion({ a: 'x', b: 42, c: true })).toBe(100);
  });

  it('returns 50 for half-filled form', () => {
    const t = makeTracker();
    expect(t.computeCompletion({ a: 'x', b: '' })).toBe(50);
  });

  it('excludes sensitive fields from completion calculation', () => {
    const t = makeTracker({ exclude: ['secret'] });
    // Only 'name' counts — 'secret' is excluded
    const pct = t.computeCompletion({ name: 'AKS', secret: '' });
    expect(pct).toBe(100);
  });

  it('returns 0 for empty values object', () => {
    const t = makeTracker();
    expect(t.computeCompletion({})).toBe(0);
  });
});

describe('FormAnalyticsTracker — custom exclude list', () => {
  it('respects custom excluded fields', () => {
    const onFieldFocus = jest.fn();
    const t = new FormAnalyticsTracker({
      callbacks: { onFieldFocus },
      exclude:   ['secret_token', 'api_key'],
    });
    t.onFieldFocus('secret_token');
    t.onFieldFocus('api_key');
    t.onFieldFocus('email');
    expect(onFieldFocus).toHaveBeenCalledTimes(1);
    expect(onFieldFocus).toHaveBeenCalledWith('email');
  });
});
