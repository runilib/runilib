import { describe, expect, it } from 'vitest';
import { inferFromObject, inferFromType } from '../core/field-builders/infer';

describe('inferFromObject', () => {
  it('infers text type for plain string values', () => {
    const schema = inferFromObject({ name: '', city: '' });
    expect(schema.name._type).toBe('text');
    expect(schema.city._type).toBe('text');
  });

  it('infers email type from key name', () => {
    const schema = inferFromObject({ email: '', emailAddress: '' });
    expect(schema.email._type).toBe('email');
    expect(schema.emailAddress._type).toBe('email');
  });

  it('infers password type from key name', () => {
    const schema = inferFromObject({ password: '', pass: '' });
    expect(schema.password._type).toBe('password');
    expect(schema.pass._type).toBe('password');
  });

  it('infers number type from value', () => {
    const schema = inferFromObject({ age: 0, score: 100 });
    expect(schema.age._type).toBe('number');
  });

  it('infers switch type for boolean values', () => {
    const schema = inferFromObject({ active: false, enabled: true });
    expect(schema.active._type).toBe('switch');
    expect(schema.enabled._type).toBe('switch');
  });

  it('infers textarea from bio/description key', () => {
    const schema = inferFromObject({ bio: '', description: '' });
    expect(schema.bio._type).toBe('textarea');
    expect(schema.description._type).toBe('textarea');
  });

  it('infers tel from phone/tel key', () => {
    const schema = inferFromObject({ phone: '', tel: '' });
    expect(schema.phone._type).toBe('tel');
  });

  it('infers date from date/birthday key', () => {
    const schema = inferFromObject({ dateOfBirth: '', birthday: '' });
    expect(schema.dateOfBirth._type).toBe('date');
    expect(schema.birthday._type).toBe('date');
  });

  it('sets default values from the object', () => {
    const schema = inferFromObject({ name: 'AKS', age: 30, active: true });
    expect(schema.name._defaultValue).toBe('AKS');
    expect(schema.age._defaultValue).toBe(30);
    expect(schema.active._defaultValue).toBe(true);
  });

  it('prettifies key as label', () => {
    const schema = inferFromObject({ firstName: '', dateOfBirth: '', vat_number: '' });
    expect(schema.firstName._label).toBe('First Name');
    expect(schema.dateOfBirth._label).toBe('Date Of Birth');
    expect(schema.vat_number._label).toBe('Vat Number');
  });

  it('applies overrides — required', () => {
    const schema = inferFromObject({ email: '' }, { email: { required: true } });
    expect(schema.email._required).toBe(true);
  });

  it('applies overrides — custom label', () => {
    const schema = inferFromObject({ email: '' }, { email: { label: 'Work email' } });
    expect(schema.email._label).toBe('Work email');
  });

  it('applies overrides — type override', () => {
    const schema = inferFromObject(
      { role: '' },
      { role: { type: 'select', options: ['admin', 'user'] } },
    );
    expect(schema.role._type).toBe('select');
    expect(schema.role._options).toHaveLength(2);
  });

  it('applies overrides — min/max', () => {
    const schema = inferFromObject({ age: 0 }, { age: { min: 18, max: 100 } });
    expect(schema.age._min).toBe(18);
    expect(schema.age._max).toBe(100);
  });

  it('applies overrides — disabled + hidden', () => {
    const schema = inferFromObject(
      { id: 'abc', secret: '' },
      { id: { disabled: true }, secret: { hidden: true } },
    );
    expect(schema.id._disabled).toBe(true);
    expect(schema.secret._hidden).toBe(true);
  });
});

describe('inferFromType', () => {
  type User = { name: string; email: string; age: number; active: boolean };

  it('builds schema from type descriptor', () => {
    const schema = inferFromType<User>({
      name: { label: 'Full name', required: true },
      email: { label: 'Email', required: true },
      age: { label: 'Age', min: 18 },
      active: { label: 'Active', type: 'switch' },
    });
    expect(schema.name._label).toBe('Full name');
    expect(schema.name._required).toBe(true);
    expect(schema.age._min).toBe(18);
    expect(schema.active._type).toBe('switch');
  });

  it('sets string default for text fields', () => {
    const schema = inferFromType<{ name: string }>({ name: { label: 'Name' } });
    expect(schema.name._defaultValue).toBe('');
  });

  it('sets 0 default for number fields', () => {
    const schema = inferFromType<{ age: number }>({
      age: { label: 'Age', type: 'number' },
    });
    expect(schema.age._defaultValue).toBe(0);
  });

  it('sets false default for switch fields', () => {
    const schema = inferFromType<{ ok: boolean }>({
      ok: { label: 'OK', type: 'switch' },
    });
    expect(schema.ok._defaultValue).toBe(false);
  });

  it('respects explicit defaultValue', () => {
    const schema = inferFromType<{ name: string }>({
      name: { label: 'Name', defaultValue: 'AKS' },
    });
    expect(schema.name._defaultValue).toBe('AKS');
  });
});
