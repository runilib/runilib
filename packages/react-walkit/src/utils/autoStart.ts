import type {
  ResolvedWalkitAutoStart,
  WalkitAutoStart,
  WalkitAutoStartMode,
} from '../types/Walkit.types';

const walkitAutoStartSessionKeys = new Set<string>();

function normalizeAutoStartMode(
  autoStart: WalkitAutoStart,
): WalkitAutoStartMode | undefined {
  if (autoStart === false || autoStart == null) {
    return undefined;
  }

  if (autoStart === true) {
    return 'always';
  }

  if (autoStart === 'always' || autoStart === 'once') {
    return autoStart;
  }

  return autoStart.mode ?? 'always';
}

export function resolveWalkitAutoStart(
  stepId: string,
  autoStart?: WalkitAutoStart,
): ResolvedWalkitAutoStart | undefined {
  const mode = autoStart ? normalizeAutoStartMode(autoStart) : undefined;

  if (!mode) {
    return undefined;
  }

  const key =
    typeof autoStart === 'object' && autoStart !== null && 'key' in autoStart
      ? (autoStart.key ?? stepId)
      : stepId;

  const rawDelay =
    typeof autoStart === 'object' && autoStart !== null && 'delay' in autoStart
      ? autoStart.delay
      : undefined;

  return {
    mode,
    key,
    delay:
      typeof rawDelay === 'number' && Number.isFinite(rawDelay)
        ? Math.max(0, rawDelay)
        : 0,
  };
}

export function hasSeenWalkitAutoStart(key: string): boolean {
  return walkitAutoStartSessionKeys.has(key);
}

export function rememberWalkitAutoStart(key: string): void {
  walkitAutoStartSessionKeys.add(key);
}

export function resetWalkitAutoStartSession(): void {
  walkitAutoStartSessionKeys.clear();
}
