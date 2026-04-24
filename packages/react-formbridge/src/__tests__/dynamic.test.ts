import { describe, expect, it } from 'vitest';
import {
  parseDynamicForm,
  parseJsonSchema,
} from '../core/field-descriptors/dynamic/dynamic';
import type { JsonFormDefinition } from '../index.native';

const SIMPLE_DEF: JsonFormDefinition = {
  id: 'contact',
  title: 'Contact us',
  submitLabel: 'Send',
  fields: [
    { name: 'name', type: 'text', label: 'Your name', required: true, order: 1 },
    { name: 'email', type: 'email', label: 'Email address', required: true, order: 2 },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
      min: 10,
      order: 3,
    },
    {
      name: 'topic',
      type: 'select',
      label: 'Topic',
      options: ['Support', 'Sales', 'Other'],
      order: 4,
    },
    { name: 'newsletter', type: 'switch', label: 'Subscribe to newsletter', order: 5 },
  ],
};

describe('parseDynamicForm', () => {
  it('creates a schema with all field names', () => {
    const { schema } = parseDynamicForm(SIMPLE_DEF);
    expect(Object.keys(schema)).toEqual([
      'name',
      'email',
      'message',
      'topic',
      'newsletter',
    ]);
  });

  it('preserves field types', () => {
    const { schema } = parseDynamicForm(SIMPLE_DEF);
    expect(schema.name._type).toBe('text');
    expect(schema.email._type).toBe('email');
    expect(schema.message._type).toBe('textarea');
    expect(schema.topic._type).toBe('select');
    expect(schema.newsletter._type).toBe('switch');
  });

  it('preserves labels', () => {
    const { schema } = parseDynamicForm(SIMPLE_DEF);
    expect(schema.name._label).toBe('Your name');
    expect(schema.email._label).toBe('Email address');
  });

  it('marks required fields', () => {
    const { schema } = parseDynamicForm(SIMPLE_DEF);
    expect(schema.name._required).toBe(true);
    expect(schema.newsletter._required).toBe(false);
  });

  it('applies min/max', () => {
    const { schema } = parseDynamicForm(SIMPLE_DEF);
    expect(schema.message._min).toBe(10);
  });

  it('converts string options to SelectOption[]', () => {
    const { schema } = parseDynamicForm(SIMPLE_DEF);
    expect(schema.topic._options).toEqual([
      { label: 'Support', value: 'Support' },
      { label: 'Sales', value: 'Sales' },
      { label: 'Other', value: 'Other' },
    ]);
  });

  it('returns correct meta', () => {
    const { meta } = parseDynamicForm(SIMPLE_DEF);
    expect(meta.id).toBe('contact');
    expect(meta.title).toBe('Contact us');
    expect(meta.submitLabel).toBe('Send');
  });

  it('returns correct fieldOrder', () => {
    const { fieldOrder } = parseDynamicForm(SIMPLE_DEF);
    expect(fieldOrder).toEqual(['name', 'email', 'message', 'topic', 'newsletter']);
  });

  it('sorts fields by order property', () => {
    const def: JsonFormDefinition = {
      fields: [
        { name: 'c', type: 'text', label: 'C', order: 3 },
        { name: 'a', type: 'text', label: 'A', order: 1 },
        { name: 'b', type: 'text', label: 'B', order: 2 },
      ],
    };
    const { fieldOrder } = parseDynamicForm(def);
    expect(fieldOrder).toEqual(['a', 'b', 'c']);
  });

  it('extracts showWhen conditions', () => {
    const def: JsonFormDefinition = {
      fields: [
        { name: 'type', type: 'select', label: 'Type', options: ['a', 'b'] },
        {
          name: 'extra',
          type: 'text',
          label: 'Extra',
          showWhen: { field: 'type', value: 'b' },
        },
      ],
    };
    const { conditions } = parseDynamicForm(def);
    expect(conditions.extra).toEqual({ field: 'type', value: 'b' });
    expect(conditions.type).toBeUndefined();
  });

  it('applies JSON validation rules', async () => {
    const { validateField } = await import('../core/validators/engine');
    const def: JsonFormDefinition = {
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Code',
          validate: [
            { type: 'required', message: 'Code is required.' },
            { type: 'min', value: 4, message: 'Min 4 chars.' },
          ],
        },
      ],
    };
    const { schema } = parseDynamicForm(def);
    const err1 = await validateField(schema.code, '', {});
    expect(err1).toBe('Code is required.');
    const err2 = await validateField(schema.code, 'ab', {});
    expect(err2).toBe('Min 4 chars.');
    const err3 = await validateField(schema.code, 'abcd', {});
    expect(err3).toBeNull();
  });

  it('handles hidden type (maps to text + hidden)', () => {
    const def: JsonFormDefinition = {
      fields: [{ name: 'csrf', type: 'hidden', label: 'CSRF' }],
    };
    const { schema } = parseDynamicForm(def);
    expect(schema.csrf._type).toBe('text');
    expect(schema.csrf._hidden).toBe(true);
  });
});

describe('parseJsonSchema', () => {
  const JS = {
    title: 'User',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string', title: 'Full name', minLength: 2, maxLength: 80 },
      email: { type: 'string', format: 'email', title: 'Email' },
      age: { type: 'number', title: 'Age', minimum: 18, maximum: 120 },
      active: { type: 'boolean', title: 'Active' },
      website: { type: 'string', format: 'uri', title: 'Website' },
      country: { type: 'string', title: 'Country', enum: ['FR', 'US', 'UK'] },
    },
  };

  it('maps all properties', () => {
    const schema = parseJsonSchema(JS);
    expect(Object.keys(schema)).toEqual([
      'name',
      'email',
      'age',
      'active',
      'website',
      'country',
    ]);
  });

  it('maps string → text', () => {
    expect(parseJsonSchema(JS).name._type).toBe('text');
  });
  it('maps email format → email', () => {
    expect(parseJsonSchema(JS).email._type).toBe('email');
  });
  it('maps number → number', () => {
    expect(parseJsonSchema(JS).age._type).toBe('number');
  });
  it('maps boolean → switch', () => {
    expect(parseJsonSchema(JS).active._type).toBe('switch');
  });
  it('maps uri format → url', () => {
    expect(parseJsonSchema(JS).website._type).toBe('url');
  });
  it('maps enum → select with options', () => {
    const schema = parseJsonSchema(JS);
    expect(schema.country._type).toBe('select');
    expect(schema.country._options).toHaveLength(3);
  });
  it('marks required fields', () => {
    const schema = parseJsonSchema(JS);
    expect(schema.name._required).toBe(true);
    expect(schema.email._required).toBe(true);
    expect(schema.age._required).toBe(false);
  });
  it('applies min/max from minLength/maxLength', () => {
    const schema = parseJsonSchema(JS);
    expect(schema.name._min).toBe(2);
    expect(schema.name._max).toBe(80);
  });
  it('applies min/max from minimum/maximum', () => {
    const schema = parseJsonSchema(JS);
    expect(schema.age._min).toBe(18);
    expect(schema.age._max).toBe(120);
  });
  it('uses title as label', () => {
    const schema = parseJsonSchema(JS);
    expect(schema.name._label).toBe('Full name');
  });
});
