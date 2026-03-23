// ─── Draft persistence ────────────────────────────────────────────────────────
export { DraftManager, usePersist }       from './persist/draft';
export {
  localStorageAdapter,
  sessionStorageAdapter,
  asyncStorageAdapter,
  resolveAdapter,
}                                         from './persist/storage';
export type { PersistOptions }            from './persist/draft';
export type { StorageAdapter, StorageType } from './persist/storage';

// ─── Reactive conditions ──────────────────────────────────────────────────────
export { ConditionMixin, evaluateAllConditions, evaluateCondition } from './conditions/conditions';
export type {
  FieldConditions,
  VisibilityMap,
  FieldVisibilityState,
  Condition,
  SimpleCondition,
  ConditionGroup,
  ConditionPredicate,
}                                         from './conditions/conditions';

// ─── useForm (updated) ────────────────────────────────────────────────────────
export { useFormV13 as useForm }          from './hooks/useForm';
export type { UseFormOptionsV13 as UseFormOptions, UseFormReturnV13 as UseFormReturn } from './hooks/useForm';

// ─── useFormWizard ────────────────────────────────────────────────────────────
export { useFormWizard }                  from './hooks/useFormWizard';
export type {
  WizardStep,
  UseFormWizardOptions,
  UseFormWizardReturn,
}                                         from './hooks/useFormWizard';
