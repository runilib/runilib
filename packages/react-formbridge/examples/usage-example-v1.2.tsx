/**
 * formura v1.2 — Features demo
 * ──────────────────────────────────
 * Demonstrates: masks, password strength, file upload
 * Same form works on React (web) and React Native.
 */

import React from 'react';
import { useForm, field } from 'formura';
import { MaskedFieldBuilder, MASKS } from 'formura'; // new in v1.2
import { FileFieldBuilder }           from 'formura'; // new in v1.2
import {
  STRENGTH_CONFIG_STRICT,
  STRENGTH_CONFIG_FR,
} from 'formura';                                      // new in v1.2

// ─── Example 1: Payment form ──────────────────────────────────────────────────
// Masks for card, expiry, CVV + file upload for invoice

export function PaymentForm() {
  const { Form, fields } = useForm({
    // ── Masked fields ────────────────────────────────────────────
    cardHolder:   field.text('Cardholder name').required().trim(),

    cardNumber:   new MaskedFieldBuilder('Card number', MASKS.CARD_16)
                    .required()
                    .validateComplete('Please enter a valid card number.')
                    .hint('16-digit card number'),

    expiry:       new MaskedFieldBuilder('Expiry date', MASKS.EXPIRY)
                    .required()
                    .validateComplete('Please enter a valid expiry date.')
                    .validate((v) => {
                      if (!v || v.length < 4) return null;
                      const [m, y] = v.split('/');
                      const now    = new Date();
                      const month  = parseInt(m, 10);
                      const year   = 2000 + parseInt(y, 10);
                      if (month < 1 || month > 12) return 'Invalid month.';
                      if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
                        return 'Card has expired.';
                      }
                      return null;
                    }),

    cvv:          new MaskedFieldBuilder('CVV', MASKS.CVV)
                    .required()
                    .validateComplete('CVV must be 3 digits.')
                    .hint('3-digit code on the back of your card'),

    // ── File upload — invoice ────────────────────────────────────
    invoice:      FileFieldBuilder.document('Invoice (optional)')
                    .hint('PDF, max 10 MB'),
  });

  return (
    <Form onSubmit={(v) => console.log('Payment:', v)}>
      <fields.cardHolder />
      <fields.cardNumber />
      <fields.expiry />
      <fields.cvv />
      <fields.invoice />
      <Form.Submit>Pay now</Form.Submit>
    </Form>
  );
}

// ─── Example 2: Sign-up with strong password ─────────────────────────────────

export function SignUpForm() {
  const { Form, fields } = useForm(
    {
      name:    field.text('Full name').required().trim(),
      email:   field.email('Email').required(),

      phone:   new MaskedFieldBuilder('Phone number', MASKS.PHONE_FR)
                 .required()
                 .validateComplete('Please enter a complete phone number.'),

      // Password with full strength indicator
      password: field.password('Password')
                  .required()
                  .withStrengthIndicator({
                    showBar:    true,
                    showLabel:  true,
                    showRules:  true,   // checklist
                    config:     STRENGTH_CONFIG_STRICT,
                    blockWeak:  true,
                    blockMsg:   'Your password is too weak.',
                  }),

      confirm:  field.password('Confirm password')
                  .required()
                  .matches('password', 'Passwords do not match.'),

      // File — profile photo
      photo:    FileFieldBuilder.profilePhoto()
                  .hint('Optional. JPG, PNG or WebP, max 5 MB.'),

      dob:      new MaskedFieldBuilder('Date of birth', MASKS.DATE_DMY)
                  .required()
                  .validateComplete('Please enter your date of birth.')
                  .hint('DD/MM/YYYY'),

      terms:    field.checkbox('I accept the Terms & Conditions').mustBeTrue(),
    },
    { validateOn: 'onTouched' }
  );

  return (
    <Form onSubmit={(v) => console.log('Sign up:', v)}>
      <fields.name />
      <fields.email />
      <fields.phone />
      <fields.password />    {/* renders strength bar + rules checklist */}
      <fields.confirm />
      <fields.photo />       {/* drag & drop on web, picker on native */}
      <fields.dob />
      <fields.terms />
      <Form.Submit loadingText="Creating account…">Create account</Form.Submit>
    </Form>
  );
}

// ─── Example 3: French KYC form ──────────────────────────────────────────────
// All French-specific masks

export function KycForm() {
  const { Form, fields } = useForm({
    firstName:   field.text('Prénom').required().trim(),
    lastName:    field.text('Nom de famille').required().trim(),

    phone:       new MaskedFieldBuilder('Téléphone', MASKS.PHONE_FR)
                   .required()
                   .validateComplete('Numéro de téléphone incomplet.'),

    birthDate:   new MaskedFieldBuilder('Date de naissance', MASKS.DATE_DMY)
                   .required()
                   .validateComplete('Date incomplète.'),

    ssn:         new MaskedFieldBuilder('NIR (Sécurité sociale)', MASKS.NIR_FR)
                   .required()
                   .validateComplete('Numéro de sécurité sociale incomplet.')
                   .hint('Numéro à 15 chiffres'),

    iban:        new MaskedFieldBuilder('IBAN', MASKS.IBAN_FR)
                   .required()
                   .uppercase()
                   .validateComplete('IBAN incomplet.')
                   .hint('FR76 XXXX XXXX...'),

    idCard:      new FileFieldBuilder('Pièce d\'identité')
                   .accept(['image/jpeg', 'image/png', 'application/pdf'])
                   .maxSize(10 * 1024 * 1024)
                   .preview(120)
                   .required('Veuillez joindre une pièce d\'identité.')
                   .hint('CNI ou passeport. JPG, PNG ou PDF. Max 10 Mo.'),

    password:    field.password('Mot de passe')
                   .required()
                   .withStrengthIndicator({
                     showBar:   true,
                     showLabel: true,
                     showRules: true,
                     config:    STRENGTH_CONFIG_FR,  // labels in French
                   }),
  });

  return (
    <Form onSubmit={(v) => console.log('KYC:', v)}>
      <fields.firstName />
      <fields.lastName />
      <fields.phone />
      <fields.birthDate />
      <fields.ssn />
      <fields.iban />
      <fields.idCard />
      <fields.password />
      <Form.Submit>Valider le dossier</Form.Submit>
    </Form>
  );
}

// ─── Example 4: All MASKS presets showcase ────────────────────────────────────

export function MasksShowcaseForm() {
  const { Form, fields } = useForm({
    phone_fr:    new MaskedFieldBuilder('Phone FR',      MASKS.PHONE_FR),
    phone_us:    new MaskedFieldBuilder('Phone US',      MASKS.PHONE_US),
    phone_intl:  new MaskedFieldBuilder('Phone Intl',    MASKS.PHONE_INTL),
    card16:      new MaskedFieldBuilder('Card (16-digit)',MASKS.CARD_16),
    card_amex:   new MaskedFieldBuilder('Card Amex',     MASKS.CARD_AMEX),
    expiry:      new MaskedFieldBuilder('Expiry',        MASKS.EXPIRY),
    cvv:         new MaskedFieldBuilder('CVV',           MASKS.CVV),
    date_dmy:    new MaskedFieldBuilder('Date DMY',      MASKS.DATE_DMY),
    date_iso:    new MaskedFieldBuilder('Date ISO',      MASKS.DATE_ISO),
    iban_fr:     new MaskedFieldBuilder('IBAN FR',       MASKS.IBAN_FR).uppercase(),
    iban_de:     new MaskedFieldBuilder('IBAN DE',       MASKS.IBAN_DE).uppercase(),
    siren:       new MaskedFieldBuilder('SIREN',         MASKS.SIREN),
    siret:       new MaskedFieldBuilder('SIRET',         MASKS.SIRET),
    zip_fr:      new MaskedFieldBuilder('ZIP FR',        MASKS.ZIP_FR),
    ip:          new MaskedFieldBuilder('IP Address',    MASKS.IP_ADDRESS),
    custom:      new MaskedFieldBuilder('Custom: +XX (999) 999-9999', '+99 (999) 999-9999'),
  });

  return (
    <Form onSubmit={(v) => console.log(v)}>
      {Object.keys(fields).map(name => {
        const F = (fields as any)[name];
        return F ? <F key={name} /> : null;
      })}
      <Form.Submit>Test masks</Form.Submit>
    </Form>
  );
}

// ─── Example 5: File upload presets ──────────────────────────────────────────

export function FileUploadsForm() {
  const { Form, fields } = useForm({
    // Profile photo — images only, preview, resize
    avatar:    FileFieldBuilder.profilePhoto('Profile photo').required(),

    // Document — PDF only
    resume:    FileFieldBuilder.document('Resume').required(),

    // Multiple attachments
    files:     FileFieldBuilder.attachments('Supporting documents', 5),

    // Spreadsheet import
    data:      FileFieldBuilder.spreadsheet('Data import (CSV/XLSX)'),

    // Fully custom
    video:     new FileFieldBuilder('Demo video')
                 .accept(['video/mp4', 'video/quicktime'])
                 .maxSize(50 * 1024 * 1024)
                 .allowVideo()
                 .dragLabel('Drop your MP4 video here')
                 .hint('MP4 or MOV. Max 50 MB.')
                 .required(),
  });

  return (
    <Form onSubmit={(v) => console.log('Files:', v)}>
      <fields.avatar />
      <fields.resume />
      <fields.files />
      <fields.data />
      <fields.video />
      <Form.Submit>Upload all</Form.Submit>
    </Form>
  );
}
