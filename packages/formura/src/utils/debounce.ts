export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function debounceAsync<T>(fn: (...args: unknown[]) => Promise<T>, ms: number): (...args: unknown[]) => Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  let reject: ((reason?: unknown) => void) | null = null;

  return (...args: unknown[]): Promise<T> => {
    if (reject) reject(new DOMException('Debounced', 'AbortError'));
    clearTimeout(timer);
    return new Promise<T>((res, rej) => {
      reject = rej;
      timer  = setTimeout(async () => {
        reject = null;
        try { res(await fn(...args)); } catch (e) { rej(e); }
      }, ms);
    });
  };
}
