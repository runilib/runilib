import {
  evaluateCondition,
  evaluateAllConditions,
  ConditionMixin,
} from '../src/conditions/conditions';
import type { FieldConditions } from '../src/conditions/conditions';

// ─── evaluateCondition ────────────────────────────────────────────────────────

describe('evaluateCondition — eq', () => {
  const vals = { plan: 'pro', country: 'FR', count: 5, active: true };

  it('matches equal string', () => {
    expect(evaluateCondition({ type: 'eq', field: 'plan', value: 'pro' }, vals)).toBe(true);
  });

  it('does not match different string', () => {
    expect(evaluateCondition({ type: 'eq', field: 'plan', value: 'free' }, vals)).toBe(false);
  });

  it('matches boolean', () => {
    expect(evaluateCondition({ type: 'eq', field: 'active', value: true }, vals)).toBe(true);
  });

  it('does not match wrong boolean', () => {
    expect(evaluateCondition({ type: 'eq', field: 'active', value: false }, vals)).toBe(false);
  });
});

describe('evaluateCondition — neq', () => {
  it('passes when values differ', () => {
    expect(evaluateCondition({ type: 'neq', field: 'plan', value: 'free' }, { plan: 'pro' })).toBe(true);
  });
  it('fails when values are equal', () => {
    expect(evaluateCondition({ type: 'neq', field: 'plan', value: 'pro' }, { plan: 'pro' })).toBe(false);
  });
});

describe('evaluateCondition — numeric comparisons', () => {
  const vals = { age: 25, score: 80, level: 3 };

  it('gt: passes when value is greater', () => {
    expect(evaluateCondition({ type: 'gt',  field: 'age', value: 18 }, vals)).toBe(true);
  });
  it('gt: fails when equal',             () => {
    expect(evaluateCondition({ type: 'gt',  field: 'age', value: 25 }, vals)).toBe(false);
  });
  it('gte: passes when equal',           () => {
    expect(evaluateCondition({ type: 'gte', field: 'age', value: 25 }, vals)).toBe(true);
  });
  it('lt: passes when value is smaller', () => {
    expect(evaluateCondition({ type: 'lt',  field: 'score', value: 100 }, vals)).toBe(true);
  });
  it('lte: passes when equal',           () => {
    expect(evaluateCondition({ type: 'lte', field: 'level', value: 3 }, vals)).toBe(true);
  });
});

describe('evaluateCondition — truthy/falsy', () => {
  it('truthy: passes for non-empty string', () => {
    expect(evaluateCondition({ type: 'truthy', field: 'name' }, { name: 'AKS' })).toBe(true);
  });
  it('truthy: fails for empty string', () => {
    expect(evaluateCondition({ type: 'truthy', field: 'name' }, { name: '' })).toBe(false);
  });
  it('falsy: passes for empty string', () => {
    expect(evaluateCondition({ type: 'falsy', field: 'name' }, { name: '' })).toBe(true);
  });
  it('falsy: fails for non-empty', () => {
    expect(evaluateCondition({ type: 'falsy', field: 'name' }, { name: 'AKS' })).toBe(false);
  });
});

describe('evaluateCondition — in/notIn', () => {
  const vals = { plan: 'pro' };
  it('in: passes when value is in list', () => {
    expect(evaluateCondition({ type: 'in', field: 'plan', values: ['pro', 'enterprise'] }, vals)).toBe(true);
  });
  it('in: fails when value is not in list', () => {
    expect(evaluateCondition({ type: 'in', field: 'plan', values: ['free', 'basic'] }, vals)).toBe(false);
  });
  it('notIn: passes when value is not in list', () => {
    expect(evaluateCondition({ type: 'notIn', field: 'plan', values: ['free'] }, vals)).toBe(true);
  });
  it('notIn: fails when value is in list', () => {
    expect(evaluateCondition({ type: 'notIn', field: 'plan', values: ['pro'] }, vals)).toBe(false);
  });
});

describe('evaluateCondition — fn predicate', () => {
  it('passes when predicate returns true', () => {
    const c = { type: 'fn' as const, fn: (v: any) => v.age >= 18 && v.country === 'FR' };
    expect(evaluateCondition(c, { age: 25, country: 'FR' })).toBe(true);
  });
  it('fails when predicate returns false', () => {
    const c = { type: 'fn' as const, fn: (v: any) => v.age >= 18 };
    expect(evaluateCondition(c, { age: 16 })).toBe(false);
  });
});

describe('evaluateCondition — group AND', () => {
  it('passes when all conditions pass', () => {
    const c = {
      op: 'AND' as const,
      conditions: [
        { type: 'eq' as const, field: 'plan',    value: 'pro' },
        { type: 'eq' as const, field: 'country', value: 'FR'  },
      ],
    };
    expect(evaluateCondition(c, { plan: 'pro', country: 'FR' })).toBe(true);
  });
  it('fails when any condition fails', () => {
    const c = {
      op: 'AND' as const,
      conditions: [
        { type: 'eq' as const, field: 'plan',    value: 'pro' },
        { type: 'eq' as const, field: 'country', value: 'US'  },
      ],
    };
    expect(evaluateCondition(c, { plan: 'pro', country: 'FR' })).toBe(false);
  });
});

describe('evaluateCondition — group OR', () => {
  it('passes when at least one condition passes', () => {
    const c = {
      op: 'OR' as const,
      conditions: [
        { type: 'eq' as const, field: 'plan', value: 'pro' },
        { type: 'eq' as const, field: 'plan', value: 'enterprise' },
      ],
    };
    expect(evaluateCondition(c, { plan: 'enterprise' })).toBe(true);
  });
  it('fails when all conditions fail', () => {
    const c = {
      op: 'OR' as const,
      conditions: [
        { type: 'eq' as const, field: 'plan', value: 'pro' },
        { type: 'eq' as const, field: 'plan', value: 'enterprise' },
      ],
    };
    expect(evaluateCondition(c, { plan: 'free' })).toBe(false);
  });
});

// ─── evaluateAllConditions ────────────────────────────────────────────────────

describe('evaluateAllConditions', () => {
  const makeMap = (overrides: Partial<FieldConditions> = {}): Record<string, FieldConditions> => ({
    companyName: {
      visible:  [{ type: 'eq', field: 'hasCompany', value: true }],
      required: [{ type: 'eq', field: 'hasCompany', value: true }],
      disabled: [],
      onHide:   'reset',
      ...overrides,
    },
  });

  it('visible: true when condition passes', () => {
    const result = evaluateAllConditions(makeMap(), { hasCompany: true });
    expect(result.companyName.visible).toBe(true);
  });

  it('visible: false when condition fails', () => {
    const result = evaluateAllConditions(makeMap(), { hasCompany: false });
    expect(result.companyName.visible).toBe(false);
  });

  it('required: true when condition passes', () => {
    const result = evaluateAllConditions(makeMap(), { hasCompany: true });
    expect(result.companyName.required).toBe(true);
  });

  it('required: false when condition fails', () => {
    const result = evaluateAllConditions(makeMap(), { hasCompany: false });
    expect(result.companyName.required).toBe(false);
  });

  it('disabled: true when condition passes', () => {
    const map = makeMap({ disabled: [{ type: 'eq', field: 'ssoEnabled', value: true }] });
    const result = evaluateAllConditions(map, { ssoEnabled: true });
    expect(result.companyName.disabled).toBe(true);
  });

  it('field with no conditions is always visible', () => {
    const map: Record<string, FieldConditions> = {
      email: { visible: [], required: [], disabled: [], onHide: 'reset' },
    };
    const result = evaluateAllConditions(map, { anything: 'value' });
    expect(result.email.visible).toBe(true);
    expect(result.email.required).toBe(false);
    expect(result.email.disabled).toBe(false);
  });

  it('multiple AND conditions — all must pass', () => {
    const map: Record<string, FieldConditions> = {
      vatNumber: {
        visible: [
          { type: 'eq', field: 'hasCompany', value: true },
          { type: 'eq', field: 'country', value: 'FR' },
        ],
        required: [],
        disabled: [],
        onHide:   'reset',
      },
    };
    expect(evaluateAllConditions(map, { hasCompany: true,  country: 'FR' }).vatNumber.visible).toBe(true);
    expect(evaluateAllConditions(map, { hasCompany: true,  country: 'US' }).vatNumber.visible).toBe(false);
    expect(evaluateAllConditions(map, { hasCompany: false, country: 'FR' }).vatNumber.visible).toBe(false);
  });
});

// ─── ConditionMixin ───────────────────────────────────────────────────────────

describe('ConditionMixin', () => {
  function make() {
    const m = new ConditionMixin();
    return m;
  }

  it('visibleWhen adds an eq condition', () => {
    const m = make();
    m.visibleWhen('plan', 'pro');
    expect(m._conditions.visible).toHaveLength(1);
    expect(m._conditions.visible[0]).toMatchObject({ type: 'eq', field: 'plan', value: 'pro' });
  });

  it('visibleWhen with predicate adds a fn condition', () => {
    const m = make();
    const fn = (v: any) => v.age >= 18;
    m.visibleWhen(fn);
    expect(m._conditions.visible[0]).toMatchObject({ type: 'fn', fn });
  });

  it('visibleWhenNot adds a neq condition', () => {
    const m = make();
    m.visibleWhenNot('plan', 'free');
    expect(m._conditions.visible[0]).toMatchObject({ type: 'neq', field: 'plan', value: 'free' });
  });

  it('visibleWhenAny adds an OR group condition', () => {
    const m = make();
    m.visibleWhenAny([['plan', 'pro'], ['plan', 'enterprise']]);
    const c = m._conditions.visible[0] as any;
    expect(c.op).toBe('OR');
    expect(c.conditions).toHaveLength(2);
  });

  it('chaining multiple visibleWhen = AND logic', () => {
    const m = make();
    m.visibleWhen('a', 1).visibleWhen('b', 2);
    expect(m._conditions.visible).toHaveLength(2);
    // Both must pass → AND logic via evaluateAllConditions
  });

  it('requiredWhen adds required condition', () => {
    const m = make();
    m.requiredWhen('hasCompany', true);
    expect(m._conditions.required[0]).toMatchObject({ type: 'eq', field: 'hasCompany', value: true });
  });

  it('disabledWhen adds disabled condition', () => {
    const m = make();
    m.disabledWhen('ssoEnabled', true);
    expect(m._conditions.disabled[0]).toMatchObject({ type: 'eq', field: 'ssoEnabled', value: true });
  });

  it('resetOnHide sets onHide to reset', () => {
    const m = make();
    m.keepOnHide().resetOnHide();
    expect(m._conditions.onHide).toBe('reset');
  });

  it('keepOnHide sets onHide to keep', () => {
    const m = make();
    m.keepOnHide();
    expect(m._conditions.onHide).toBe('keep');
  });

  it('clearOnHide sets onHide to clear', () => {
    const m = make();
    m.clearOnHide();
    expect(m._conditions.onHide).toBe('clear');
  });

  it('visibleWhenGt adds gt condition', () => {
    const m = make();
    m.visibleWhenGt('score', 50);
    expect(m._conditions.visible[0]).toMatchObject({ type: 'gt', field: 'score', value: 50 });
  });

  it('visibleWhenIn adds in condition', () => {
    const m = make();
    m.visibleWhenIn('role', ['admin', 'manager']);
    expect(m._conditions.visible[0]).toMatchObject({ type: 'in', field: 'role', values: ['admin', 'manager'] });
  });
});
