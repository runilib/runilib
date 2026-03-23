/**
 * formura — i18n
 * ──────────────────
 * Internationalisation of all built-in validation error messages.
 * Supports interpolation, pluralisation, and locale packs.
 */

// ─── Message map ──────────────────────────────────────────────────────────────

export interface LocaleMessages {
  // Built-in validators
  required:        string;
  email:           string;
  url:             string;
  tel:             string;
  pattern:         string;

  min:             string | ((ctx: { min: number })    => string);
  max:             string | ((ctx: { max: number })    => string);
  minLength:       string | ((ctx: { min: number })    => string);
  maxLength:       string | ((ctx: { max: number })    => string);
  minValue:        string | ((ctx: { min: number })    => string);
  maxValue:        string | ((ctx: { max: number })    => string);

  // Password
  strong:          string;
  strongLength:    string | ((ctx: { min: number })    => string);
  strongUpper:     string;
  strongLower:     string;
  strongNumber:    string;
  strongSpecial:   string;
  strongCommon:    string;
  passwordWeak:    string;

  // Boolean
  mustBeTrue:      string;
  mustBeFalse:     string;

  // Cross-field
  matches:         string | ((ctx: { field: string })  => string);

  // File upload
  fileRequired:    string;
  fileSize:        string | ((ctx: { max: string })    => string);
  fileType:        string | ((ctx: { types: string })  => string);
  fileMaxFiles:    string | ((ctx: { max: number })    => string);
  fileTooShort:    string;
  fileTooLong:     string;

  // Phone
  phoneRequired:   string;
  phoneTooShort:   string;
  phoneTooLong:    string;

  // Mask
  maskIncomplete:  string;

  // Generic
  invalid:         string;
  tooShort:        string | ((ctx: { min: number })    => string);
  tooLong:         string | ((ctx: { max: number })    => string);
  integer:         string;
  positive:        string;

  // Async (async validator status)
  validating:      string;
}

type PartialMessages = Partial<LocaleMessages>;

// ─── Built-in locale packs ───────────────────────────────────────────────────

const EN: LocaleMessages = {
  required:       'This field is required.',
  email:          'Please enter a valid email address.',
  url:            'Please enter a valid URL (starting with http:// or https://).',
  tel:            'Please enter a valid phone number.',
  pattern:        'Invalid format.',
  min:            ({ min }) => `Must be at least ${min} characters.`,
  max:            ({ max }) => `Must be at most ${max} characters.`,
  minLength:      ({ min }) => `Must be at least ${min} characters.`,
  maxLength:      ({ max }) => `Must be at most ${max} characters.`,
  minValue:       ({ min }) => `Value must be at least ${min}.`,
  maxValue:       ({ max }) => `Value must be at most ${max}.`,
  strong:         'Password is too weak.',
  strongLength:   ({ min }) => `Password must be at least ${min} characters.`,
  strongUpper:    'Password must contain at least one uppercase letter.',
  strongLower:    'Password must contain at least one lowercase letter.',
  strongNumber:   'Password must contain at least one number.',
  strongSpecial:  'Password must contain at least one special character.',
  strongCommon:   'This password is too common. Choose a more unique one.',
  passwordWeak:   'Your password is too weak to be accepted.',
  mustBeTrue:     'You must accept this.',
  mustBeFalse:    'This must be unchecked.',
  matches:        'Values do not match.',
  fileRequired:   'Please select a file.',
  fileSize:       ({ max }) => `File is too large. Maximum size is ${max}.`,
  fileType:       ({ types }) => `File type not accepted. Allowed: ${types}.`,
  fileMaxFiles:   ({ max }) => `You can upload at most ${max} files.`,
  fileTooShort:   'Phone number is too short.',
  fileTooLong:    'Phone number is too long.',
  phoneRequired:  'Please enter a phone number.',
  phoneTooShort:  'Phone number is too short.',
  phoneTooLong:   'Phone number is too long.',
  maskIncomplete: 'Please complete this field.',
  invalid:        'This value is not valid.',
  tooShort:       ({ min }) => `Must be at least ${min} characters.`,
  tooLong:        ({ max }) => `Must be at most ${max} characters.`,
  integer:        'Must be a whole number.',
  positive:       'Must be a positive number.',
  validating:     'Validating…',
};

const FR: LocaleMessages = {
  required:       'Ce champ est obligatoire.',
  email:          'Veuillez entrer une adresse email valide.',
  url:            'Veuillez entrer une URL valide (commençant par http:// ou https://).',
  tel:            'Veuillez entrer un numéro de téléphone valide.',
  pattern:        'Format invalide.',
  min:            ({ min }) => `Minimum ${min} caractères requis.`,
  max:            ({ max }) => `Maximum ${max} caractères autorisés.`,
  minLength:      ({ min }) => `Minimum ${min} caractères requis.`,
  maxLength:      ({ max }) => `Maximum ${max} caractères autorisés.`,
  minValue:       ({ min }) => `La valeur doit être au moins ${min}.`,
  maxValue:       ({ max }) => `La valeur ne peut pas dépasser ${max}.`,
  strong:         'Le mot de passe est trop faible.',
  strongLength:   ({ min }) => `Le mot de passe doit contenir au moins ${min} caractères.`,
  strongUpper:    'Le mot de passe doit contenir au moins une lettre majuscule.',
  strongLower:    'Le mot de passe doit contenir au moins une lettre minuscule.',
  strongNumber:   'Le mot de passe doit contenir au moins un chiffre.',
  strongSpecial:  'Le mot de passe doit contenir au moins un caractère spécial.',
  strongCommon:   'Ce mot de passe est trop courant. Choisissez-en un plus unique.',
  passwordWeak:   'Votre mot de passe est trop faible pour être accepté.',
  mustBeTrue:     'Vous devez accepter cette condition.',
  mustBeFalse:    'Cette case doit être décochée.',
  matches:        'Les valeurs ne correspondent pas.',
  fileRequired:   'Veuillez sélectionner un fichier.',
  fileSize:       ({ max }) => `Fichier trop volumineux. Taille maximale : ${max}.`,
  fileType:       ({ types }) => `Type de fichier non accepté. Autorisés : ${types}.`,
  fileMaxFiles:   ({ max }) => `Vous pouvez télécharger au maximum ${max} fichiers.`,
  fileTooShort:   'Numéro de téléphone trop court.',
  fileTooLong:    'Numéro de téléphone trop long.',
  phoneRequired:  'Veuillez entrer un numéro de téléphone.',
  phoneTooShort:  'Numéro de téléphone trop court.',
  phoneTooLong:   'Numéro de téléphone trop long.',
  maskIncomplete: 'Veuillez compléter ce champ.',
  invalid:        'Cette valeur n\'est pas valide.',
  tooShort:       ({ min }) => `Minimum ${min} caractères requis.`,
  tooLong:        ({ max }) => `Maximum ${max} caractères autorisés.`,
  integer:        'Doit être un nombre entier.',
  positive:       'Doit être un nombre positif.',
  validating:     'Vérification en cours…',
};

const ES: LocaleMessages = {
  required:       'Este campo es obligatorio.',
  email:          'Por favor ingresa un correo electrónico válido.',
  url:            'Por favor ingresa una URL válida.',
  tel:            'Por favor ingresa un número de teléfono válido.',
  pattern:        'Formato inválido.',
  min:            ({ min }) => `Mínimo ${min} caracteres requeridos.`,
  max:            ({ max }) => `Máximo ${max} caracteres permitidos.`,
  minLength:      ({ min }) => `Mínimo ${min} caracteres requeridos.`,
  maxLength:      ({ max }) => `Máximo ${max} caracteres permitidos.`,
  minValue:       ({ min }) => `El valor debe ser al menos ${min}.`,
  maxValue:       ({ max }) => `El valor no puede superar ${max}.`,
  strong:         'La contraseña es demasiado débil.',
  strongLength:   ({ min }) => `La contraseña debe tener al menos ${min} caracteres.`,
  strongUpper:    'Debe contener al menos una letra mayúscula.',
  strongLower:    'Debe contener al menos una letra minúscula.',
  strongNumber:   'Debe contener al menos un número.',
  strongSpecial:  'Debe contener al menos un carácter especial.',
  strongCommon:   'Esta contraseña es demasiado común.',
  passwordWeak:   'Tu contraseña es demasiado débil.',
  mustBeTrue:     'Debes aceptar esto.',
  mustBeFalse:    'Esto debe estar desmarcado.',
  matches:        'Los valores no coinciden.',
  fileRequired:   'Por favor selecciona un archivo.',
  fileSize:       ({ max }) => `Archivo demasiado grande. Tamaño máximo: ${max}.`,
  fileType:       ({ types }) => `Tipo de archivo no aceptado. Permitidos: ${types}.`,
  fileMaxFiles:   ({ max }) => `Puedes subir como máximo ${max} archivos.`,
  fileTooShort:   'Número de teléfono demasiado corto.',
  fileTooLong:    'Número de teléfono demasiado largo.',
  phoneRequired:  'Por favor ingresa un número de teléfono.',
  phoneTooShort:  'Número de teléfono demasiado corto.',
  phoneTooLong:   'Número de teléfono demasiado largo.',
  maskIncomplete: 'Por favor completa este campo.',
  invalid:        'Este valor no es válido.',
  tooShort:       ({ min }) => `Mínimo ${min} caracteres.`,
  tooLong:        ({ max }) => `Máximo ${max} caracteres.`,
  integer:        'Debe ser un número entero.',
  positive:       'Debe ser un número positivo.',
  validating:     'Verificando…',
};

const DE: LocaleMessages = {
  required:       'Dieses Feld ist erforderlich.',
  email:          'Bitte gib eine gültige E-Mail-Adresse ein.',
  url:            'Bitte gib eine gültige URL ein.',
  tel:            'Bitte gib eine gültige Telefonnummer ein.',
  pattern:        'Ungültiges Format.',
  min:            ({ min }) => `Mindestens ${min} Zeichen erforderlich.`,
  max:            ({ max }) => `Maximal ${max} Zeichen erlaubt.`,
  minLength:      ({ min }) => `Mindestens ${min} Zeichen erforderlich.`,
  maxLength:      ({ max }) => `Maximal ${max} Zeichen erlaubt.`,
  minValue:       ({ min }) => `Wert muss mindestens ${min} betragen.`,
  maxValue:       ({ max }) => `Wert darf ${max} nicht überschreiten.`,
  strong:         'Passwort ist zu schwach.',
  strongLength:   ({ min }) => `Passwort muss mindestens ${min} Zeichen lang sein.`,
  strongUpper:    'Passwort muss mindestens einen Großbuchstaben enthalten.',
  strongLower:    'Passwort muss mindestens einen Kleinbuchstaben enthalten.',
  strongNumber:   'Passwort muss mindestens eine Zahl enthalten.',
  strongSpecial:  'Passwort muss mindestens ein Sonderzeichen enthalten.',
  strongCommon:   'Dieses Passwort ist zu gebräuchlich.',
  passwordWeak:   'Ihr Passwort ist zu schwach.',
  mustBeTrue:     'Du musst dies akzeptieren.',
  mustBeFalse:    'Dies muss deaktiviert sein.',
  matches:        'Werte stimmen nicht überein.',
  fileRequired:   'Bitte wähle eine Datei aus.',
  fileSize:       ({ max }) => `Datei zu groß. Maximale Größe: ${max}.`,
  fileType:       ({ types }) => `Dateityp nicht akzeptiert. Erlaubt: ${types}.`,
  fileMaxFiles:   ({ max }) => `Du kannst maximal ${max} Dateien hochladen.`,
  fileTooShort:   'Telefonnummer zu kurz.',
  fileTooLong:    'Telefonnummer zu lang.',
  phoneRequired:  'Bitte gib eine Telefonnummer ein.',
  phoneTooShort:  'Telefonnummer ist zu kurz.',
  phoneTooLong:   'Telefonnummer ist zu lang.',
  maskIncomplete: 'Bitte vervollständige dieses Feld.',
  invalid:        'Dieser Wert ist ungültig.',
  tooShort:       ({ min }) => `Mindestens ${min} Zeichen.`,
  tooLong:        ({ max }) => `Maximal ${max} Zeichen.`,
  integer:        'Muss eine ganze Zahl sein.',
  positive:       'Muss eine positive Zahl sein.',
  validating:     'Wird überprüft…',
};

const PT: LocaleMessages = {
  required:       'Este campo é obrigatório.',
  email:          'Por favor insira um endereço de email válido.',
  url:            'Por favor insira uma URL válida.',
  tel:            'Por favor insira um número de telefone válido.',
  pattern:        'Formato inválido.',
  min:            ({ min }) => `Mínimo de ${min} caracteres necessários.`,
  max:            ({ max }) => `Máximo de ${max} caracteres permitidos.`,
  minLength:      ({ min }) => `Mínimo de ${min} caracteres necessários.`,
  maxLength:      ({ max }) => `Máximo de ${max} caracteres permitidos.`,
  minValue:       ({ min }) => `O valor deve ser pelo menos ${min}.`,
  maxValue:       ({ max }) => `O valor não pode exceder ${max}.`,
  strong:         'A senha é muito fraca.',
  strongLength:   ({ min }) => `A senha deve ter pelo menos ${min} caracteres.`,
  strongUpper:    'A senha deve conter pelo menos uma letra maiúscula.',
  strongLower:    'A senha deve conter pelo menos uma letra minúscula.',
  strongNumber:   'A senha deve conter pelo menos um número.',
  strongSpecial:  'A senha deve conter pelo menos um caractere especial.',
  strongCommon:   'Esta senha é muito comum.',
  passwordWeak:   'Sua senha é muito fraca.',
  mustBeTrue:     'Você deve aceitar isso.',
  mustBeFalse:    'Isso deve estar desmarcado.',
  matches:        'Os valores não correspondem.',
  fileRequired:   'Por favor selecione um arquivo.',
  fileSize:       ({ max }) => `Arquivo muito grande. Tamanho máximo: ${max}.`,
  fileType:       ({ types }) => `Tipo de arquivo não aceito. Permitidos: ${types}.`,
  fileMaxFiles:   ({ max }) => `Você pode enviar no máximo ${max} arquivos.`,
  fileTooShort:   'Número de telefone muito curto.',
  fileTooLong:    'Número de telefone muito longo.',
  phoneRequired:  'Por favor insira um número de telefone.',
  phoneTooShort:  'Número de telefone muito curto.',
  phoneTooLong:   'Número de telefone muito longo.',
  maskIncomplete: 'Por favor complete este campo.',
  invalid:        'Este valor não é válido.',
  tooShort:       ({ min }) => `Mínimo de ${min} caracteres.`,
  tooLong:        ({ max }) => `Máximo de ${max} caracteres.`,
  integer:        'Deve ser um número inteiro.',
  positive:       'Deve ser um número positivo.',
  validating:     'Verificando…',
};

// ─── Locale registry ─────────────────────────────────────────────────────────

const LOCALES: Record<string, LocaleMessages> = { en: EN, fr: FR, es: ES, de: DE, pt: PT };
let ACTIVE_LOCALE = 'en';
let ACTIVE_MESSAGES: LocaleMessages = EN;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Set the active locale for all formura validation messages.
 * Call once before your app renders.
 *
 * @example
 * // Use built-in French locale
 * setLocale('fr');
 *
 * // Use built-in locale with overrides
 * setLocale('fr', { required: 'Champ requis.' });
 *
 * // Register a new locale
 * setLocale('ar', { required: 'هذا الحقل مطلوب.', ... });
 */
export function setLocale(locale: string, overrides: PartialMessages = {}): void {
  const base = LOCALES[locale] ?? LOCALES.en;
  ACTIVE_LOCALE   = locale;
  ACTIVE_MESSAGES = { ...base, ...overrides };
  LOCALES[locale] = ACTIVE_MESSAGES;
}

/**
 * Register a new locale pack (useful for community-contributed translations).
 *
 * @example
 * import 'formura/locales/fr'; // auto-calls registerLocale('fr', messages)
 */
export function registerLocale(locale: string, messages: LocaleMessages): void {
  LOCALES[locale] = messages;
}

/** Get the current locale code */
export function getLocale(): string { return ACTIVE_LOCALE; }

/**
 * Get a message by key, with optional interpolation context.
 *
 * @example
 * t('required')                  // 'Ce champ est obligatoire.'
 * t('min', { min: 8 })           // 'Minimum 8 caractères requis.'
 */
export function t(key: keyof LocaleMessages, ctx: Record<string, unknown> = {}): string {
  const msg = ACTIVE_MESSAGES[key];
  if (!msg) return key;
  if (typeof msg === 'function') {
    try { return (msg as Function)(ctx); } catch { return key; }
  }
  return msg;
}

/** Get a message or fall back to a custom string */
export function tOr(key: keyof LocaleMessages, fallback: string, ctx: Record<string, unknown> = {}): string {
  try { return t(key, ctx); } catch { return fallback; }
}

export type { LocaleMessages, PartialMessages };
export { EN as LOCALE_EN, FR as LOCALE_FR, ES as LOCALE_ES, DE as LOCALE_DE, PT as LOCALE_PT };
