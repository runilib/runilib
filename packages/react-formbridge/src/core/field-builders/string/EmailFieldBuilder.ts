import { StringFieldBuilder } from './StringFieldBuilder';

function normalizeEmailDomains(domains: string[]): string[] {
  return [
    ...new Set(
      domains
        .map((domain) => domain.trim().toLowerCase().replace(/^@+/, ''))
        .filter(Boolean),
    ),
  ];
}

export class EmailFieldBuilder extends StringFieldBuilder {
  /** Reject common personal inbox domains while still accepting any other valid email domain */
  excludeEmailDomains(domains: string[], message?: string): this {
    const blockedDomains = normalizeEmailDomains(domains);

    if (!blockedDomains.length) return this;

    const blocked = new Set(blockedDomains);

    return this.validate((value) => {
      if (typeof value !== 'string' || !value.trim()) return null;

      const email = value.trim().toLowerCase();
      const atIndex = email.lastIndexOf('@');

      if (atIndex === -1) return null;

      const domain = email.slice(atIndex + 1);

      return blocked.has(domain)
        ? (message ?? 'Please use a non-personal email address.')
        : null;
    });
  }
}
