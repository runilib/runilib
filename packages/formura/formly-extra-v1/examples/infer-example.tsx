/**
 * formura — field.infer() examples
 * ─────────────────────────────────────
 * The most powerful feature: generate a form from an existing object or TypeScript type.
 * Zero schema to write, zero type duplication.
 */

import React, { useEffect } from 'react';
import { useForm }            from 'formura';
import { inferFromObject, inferFromType } from 'formura'; // added exports

// ─── Example 1: Edit form from an existing API object ─────────────────────────
// No schema to write — just pass the object you got from the server.

interface User {
  id:          string;
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  bio:         string;
  website:     string;
  dateOfBirth: string;
  active:      boolean;
  role:        string;
}

const existingUser: User = {
  id:          'usr_abc123',
  firstName:   'AKS',
  lastName:    'Dev',
  email:       'aks@unikit.dev',
  phone:       '+33612345678',
  bio:         'Senior Frontend Engineer. Building react-unikit.',
  website:     'https://unikit.dev',
  dateOfBirth: '1990-03-15',
  active:      true,
  role:        'admin',
};

export function EditUserForm() {
  const schema = inferFromObject(existingUser, {
    // id is read-only — hide it from the form
    id:        { hidden: true },
    // Override auto-detected labels
    firstName: { required: true, label: 'First name' },
    lastName:  { required: true, label: 'Last name'  },
    email:     { required: true },
    phone:     { label: 'Phone number' },
    bio:       { max: 300, hint: 'Max 300 characters.' },
    // Override type — role becomes a select
    role:      { type: 'select', options: [
      { label: 'Admin',  value: 'admin'  },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ]},
  });

  const { Form, fields } = useForm(schema);

  return (
    <Form onSubmit={(values) => console.log('Saved:', values)}>
      <fields.firstName />
      <fields.lastName />
      <fields.email />
      <fields.phone />
      <fields.bio />
      <fields.website />
      <fields.dateOfBirth />
      <fields.role />
      <fields.active />
      <Form.Submit>Save changes</Form.Submit>
    </Form>
  );
}

// ─── Example 2: From a TypeScript type (no object) ────────────────────────────
// You have a type but no instance. Just describe the fields with overrides.

interface Product {
  name:        string;
  price:       number;
  category:    string;
  description: string;
  inStock:     boolean;
  sku:         string;
}

export function CreateProductForm() {
  const schema = inferFromType<Product>({
    name:        { label: 'Product name', required: true, min: 2 },
    price:       { label: 'Price (€)',    required: true, min: 0 },
    category:    { label: 'Category',     required: true, type: 'select',
                   options: ['Electronics','Clothing','Food','Books'] },
    description: { label: 'Description', type: 'textarea', max: 500 },
    inStock:     { label: 'In stock',     type: 'switch', defaultValue: true },
    sku:         { label: 'SKU code',     required: true,
                   placeholder: 'e.g. PRD-001' },
  });

  const { Form, fields } = useForm(schema, { validateOn: 'onTouched' });

  return (
    <Form onSubmit={(values) => console.log('Created product:', values)}>
      <fields.name />
      <fields.sku />
      <fields.price />
      <fields.category />
      <fields.description />
      <fields.inStock />
      <Form.Submit>Create product</Form.Submit>
    </Form>
  );
}

// ─── Example 3: Edit form with prefilled values from API ──────────────────────

export function EditProductForm({ productId }: { productId: string }) {
  const schema = inferFromType<Product>({
    name:        { label: 'Product name', required: true },
    price:       { label: 'Price (€)',    required: true, min: 0 },
    category:    { type: 'select', options: ['Electronics','Clothing','Food','Books'] },
    description: { type: 'textarea' },
    inStock:     { type: 'switch' },
    sku:         { label: 'SKU', disabled: true },  // SKU can't be changed
  });

  const { Form, fields, reset } = useForm(schema);

  // Prefill from API
  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(product => reset(product));
  }, [productId, reset]);

  return (
    <Form onSubmit={(values) => console.log('Updated:', values)}>
      <fields.name />
      <fields.sku />       {/* disabled — shows value but can't edit */}
      <fields.price />
      <fields.category />
      <fields.description />
      <fields.inStock />
      <Form.Submit>Update product</Form.Submit>
    </Form>
  );
}
