/**
 * Tests for requirement categorisation.
 *
 * The grouping is what turns a flat list of requirements into scannable
 * sections, so the properties that matter are: every type the server contract
 * allows lands somewhere visible, order is stable, and nothing is dropped or
 * mutated.
 */
import { describe, it, expect } from 'vitest';
import type { Requirement } from '../server/schema';
import {
  ALL_REQUIREMENT_TYPES,
  CATEGORIES,
  categoryFor,
  groupByCategory,
  importanceTally,
} from '../src/components/requirementCategories';

function makeRequirement(overrides: Partial<Requirement> = {}): Requirement {
  return {
    id: 'req-1',
    text: 'A requirement',
    sourceQuote: 'A requirement',
    spanStart: 0,
    spanEnd: 0,
    type: 'skill',
    importance: 'mandatory',
    status: 'supported',
    candidateEvidence: [],
    rationale: 'r',
    action: null,
    verificationQuestion: null,
    ...overrides,
  };
}

describe('category coverage', () => {
  it('every requirement type in the server contract maps to a category', () => {
    // Guards against a type being added to the schema but never given a
    // category: it would then silently vanish from the report, which is
    // exactly the "brief quietly omits a requirement" failure this grouping
    // exists to avoid.
    const unmapped = ALL_REQUIREMENT_TYPES.filter(
      (type) => categoryFor(type).label === 'Other requirements',
    ).filter((type) => type !== 'other');
    expect(unmapped).toEqual([]);
  });

  it('no type is claimed by two categories', () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const category of CATEGORIES) {
      for (const type of category.types) {
        const existing = seen.get(type);
        if (existing) {
          duplicates.push(`${type} (${existing} / ${category.label})`);
        } else {
          seen.set(type, category.label);
        }
      }
    }
    expect(duplicates).toEqual([]);
  });

  it('every category has a label, blurb, and icon key', () => {
    for (const category of CATEGORIES) {
      expect(category.label.length).toBeGreaterThan(0);
      expect(category.blurb.length).toBeGreaterThan(0);
      expect(category.iconKey.length).toBeGreaterThan(0);
    }
  });

  it('"other" is the fallback for an unrecognised type', () => {
    expect(categoryFor('other').label).toBe('Other requirements');
    // Type-safe cast: guards the defensive fallback against a future type.
    expect(
      categoryFor('not_a_real_type' as Requirement['type']).label,
    ).toBe('Other requirements');
  });
});

describe('groupByCategory', () => {
  it('buckets requirements and drops empty categories', () => {
    const groups = groupByCategory([
      makeRequirement({ id: 'e1', type: 'education' }),
      makeRequirement({ id: 's1', type: 'skill' }),
      makeRequirement({ id: 's2', type: 'skill' }),
    ]);
    expect(groups.map((g) => g.category.label)).toEqual([
      'Education & credentials',
      'Skills',
    ]);
    expect(groups[1].items.map((r) => r.id)).toEqual(['s1', 's2']);
  });

  it('returns no groups for an empty list', () => {
    expect(groupByCategory([])).toEqual([]);
  });

  it('places mandatory requirements before preferred inside a category', () => {
    const groups = groupByCategory([
      makeRequirement({ id: 'p1', type: 'skill', importance: 'preferred' }),
      makeRequirement({ id: 'm1', type: 'skill', importance: 'mandatory' }),
      makeRequirement({ id: 'p2', type: 'skill', importance: 'preferred' }),
      makeRequirement({ id: 'm2', type: 'skill', importance: 'mandatory' }),
    ]);
    expect(groups[0].items.map((r) => r.id)).toEqual(['m1', 'm2', 'p1', 'p2']);
  });

  it('orders categories by the table, not by input order', () => {
    // Licence comes first in the table, so it must lead even though the
    // education requirement appears first in the input.
    const groups = groupByCategory([
      makeRequirement({ id: 'edu', type: 'education' }),
      makeRequirement({ id: 'lic', type: 'licence' }),
      makeRequirement({ id: 'exp', type: 'experience' }),
    ]);
    expect(groups.map((g) => g.category.label)).toEqual([
      'Licences & registration',
      'Education & credentials',
      'Experience',
    ]);
  });

  it('covers all eleven requirement types across the table', () => {
    const groups = groupByCategory(
      ALL_REQUIREMENT_TYPES.map((type, i) =>
        makeRequirement({ id: `r-${i}`, type }),
      ),
    );
    const grouped = groups.flatMap((g) => g.items.map((r) => r.id)).sort();
    const input = ALL_REQUIREMENT_TYPES.map((_, i) => `r-${i}`).sort();
    expect(grouped).toEqual(input);
  });

  it('does not mutate the input array or its order', () => {
    const input = [
      makeRequirement({ id: 'p', type: 'skill', importance: 'preferred' }),
      makeRequirement({ id: 'm', type: 'skill', importance: 'mandatory' }),
    ];
    const snapshot = input.map((r) => r.id);
    groupByCategory(input);
    expect(input.map((r) => r.id)).toEqual(snapshot);
  });

  it('groups hard constraints (licence, location, schedule) by category too', () => {
    const groups = groupByCategory([
      makeRequirement({ id: 'h1', type: 'licence', status: 'hard_constraint' }),
      makeRequirement({ id: 'h2', type: 'location', status: 'hard_constraint' }),
      makeRequirement({ id: 'h3', type: 'schedule', status: 'hard_constraint' }),
    ]);
    expect(groups.map((g) => g.category.label)).toEqual([
      'Licences & registration',
      'Location',
      'Hours & availability',
    ]);
  });
});

describe('importanceTally', () => {
  it('counts mandatory and preferred items in a group', () => {
    const items = [
      makeRequirement({ importance: 'mandatory' }),
      makeRequirement({ importance: 'mandatory' }),
      makeRequirement({ importance: 'preferred' }),
      makeRequirement({ importance: 'unclear' }),
    ];
    // "unclear" is not mandatory, so it is reported as preferred to keep the
    // two numbers summing to the group size shown in the heading.
    expect(importanceTally(items)).toEqual({ mandatory: 2, preferred: 2 });
  });

  it('reports zeros for an empty group', () => {
    expect(importanceTally([])).toEqual({ mandatory: 0, preferred: 0 });
  });
});
