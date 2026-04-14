import type { FieldReference, ValidationPath } from '../../types/validation';

export function ref<Path extends string>(path: Path): FieldReference<Path> {
  return {
    __type: 'field-ref',
    path,
  };
}

export function isFieldReference(value: unknown): value is FieldReference {
  return Boolean(
    value &&
      typeof value === 'object' &&
      '__type' in value &&
      (value as FieldReference).__type === 'field-ref',
  );
}

export function normalizeReferencePath(path: string | ValidationPath): ValidationPath {
  if (Array.isArray(path)) {
    return path.filter((segment) => segment !== '');
  }

  return path
    .split('.')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function getValueAtPath(
  source: Record<string, unknown>,
  path: string | ValidationPath,
): unknown {
  const segments = normalizeReferencePath(path);
  let current: unknown = source;

  for (const segment of segments) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string | number, unknown>)[segment];
  }

  return current;
}

export function resolveReferenceValue(
  reference: FieldReference | string,
  values: Record<string, unknown>,
): unknown {
  return getValueAtPath(
    values,
    typeof reference === 'string' ? reference : reference.path,
  );
}
