import type { Locale, Translations } from '../types';
import { en } from './en';
import { fr } from './fr';

export const translations: Record<Locale, Translations> = { en, fr };

export type { Locale, Translations };
export { en, fr };
