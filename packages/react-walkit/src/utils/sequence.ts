type SequenceInput = {
  sequence: number;
};

export function resolveWalkitSequence(input: SequenceInput, targetLabel: string): number {
  const rawSequence = input.sequence;

  if (typeof rawSequence !== 'number' || !Number.isFinite(rawSequence)) {
    throw new TypeError(
      `[@runilib/react-walkit] Missing valid "sequence" for ${targetLabel}.`,
    );
  }

  return rawSequence;
}

export function withWalkitSequence<T extends object>(
  target: T,
  sequence: number,
): T & { sequence: number } {
  return {
    ...target,
    sequence,
  };
}
