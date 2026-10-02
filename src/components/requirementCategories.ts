/**
 * Requirement categorisation: groups requirements by what kind of thing they
 * are, so a flat list of fourteen items reads as a short set of scannable
 * sections instead of one wall.
 *
 * Pure and React-free by design - the renderer owns the icons and maps
 * `iconKey` to them, which keeps this logic directly unit-testable.
 */
import type { Requirement } from '../types';

export type RequirementType = Requirement['type'];

/** Stable identifier the renderer maps to an icon component. */
export type CategoryIconKey =
  | 'shieldCheck'
  | 'graduationCap'
  | 'award'
  | 'briefcase'
  | 'users'
  | 'wrench'
  | 'languages'
  | 'mapPin'
  | 'calendarClock'
  | 'fileText';

export interface Category {
  label: string;
  blurb: string;
  iconKey: CategoryIconKey;
  types: readonly RequirementType[];
}

/**
 * Display order is deliberate: things that decide whether you can legally
 * apply come first, credentials next, then what you have actually done.
 * Every Requirement['type'] in the contract is claimed by exactly one
 * category - asserted by the test suite, so a newly added type fails loudly
 * rather than silently disappearing from the report.
 */
export const CATEGORIES: readonly Category[] = [
  {
    label: 'Licences & registration',
    blurb: 'Regulatory permissions this role depends on.',
    iconKey: 'shieldCheck',
    types: ['licence', 'work_authorization'],
  },
  {
    label: 'Education & credentials',
    blurb: 'Qualifications the role expects.',
    iconKey: 'graduationCap',
    types: ['education'],
  },
  {
    label: 'Certifications',
    blurb: 'Certificates and courses the advert names directly.',
    iconKey: 'award',
    types: ['certification'],
  },
  {
    label: 'Experience',
    blurb: 'Roles, durations, and backgrounds the advert asks for.',
    iconKey: 'briefcase',
    types: ['experience'],
  },
  {
    label: 'Skills',
    blurb: 'Capabilities and personal qualities the advert requires.',
    iconKey: 'users',
    types: ['skill'],
  },
  {
    label: 'Role duties',
    blurb: 'What you would actually be expected to do.',
    iconKey: 'wrench',
    types: ['duty'],
  },
  {
    label: 'Languages',
    blurb: 'Language requirements stated by the advert.',
    iconKey: 'languages',
    types: ['language'],
  },
  {
    label: 'Location',
    blurb: 'Where this role is based.',
    iconKey: 'mapPin',
    types: ['location'],
  },
  {
    label: 'Hours & availability',
    blurb: 'The shifts, hours, and availability this role needs.',
    iconKey: 'calendarClock',
    types: ['schedule'],
  },
  {
    label: 'Other requirements',
    blurb: 'Stated requirements that fit none of the categories above.',
    iconKey: 'fileText',
    types: ['other'],
  },
];

const CATEGORY_BY_TYPE = new Map<RequirementType, Category>(
  CATEGORIES.flatMap((category) =>
    category.types.map((type) => [type, category] as const),
  ),
);

const FALLBACK_CATEGORY = CATEGORIES[CATEGORIES.length - 1] as Category;

/** Every type the server contract allows, in schema order. */
export const ALL_REQUIREMENT_TYPES: readonly RequirementType[] = [
  'duty',
  'skill',
  'education',
  'experience',
  'certification',
  'licence',
  'language',
  'location',
  'work_authorization',
  'schedule',
  'other',
];

export function categoryFor(type: RequirementType): Category {
  // Unreachable while the contract and this table agree (the test suite
  // asserts that they do), but the fallback keeps the UI total rather than
  // throwing if a new type is ever added to the contract.
  return CATEGORY_BY_TYPE.get(type) ?? FALLBACK_CATEGORY;
}

export interface CategoryGroup {
  category: Category;
  items: Requirement[];
}

/**
 * Buckets requirements by category, preserving CATEGORIES order and skipping
 * empty buckets so an advert with no language requirement simply has no
 * Languages section. Within a bucket, mandatory requirements come before
 * preferred ones so the deciding items are always read first.
 *
 * Does not mutate the input: `filter` already returns a fresh array, so the
 * in-place `sort` below is safe.
 */
export function groupByCategory(
  requirements: readonly Requirement[],
): CategoryGroup[] {
  return CATEGORIES.map((category) => {
    const items = requirements
      .filter((req) => category.types.includes(req.type))
      .sort((a, b) => {
        const rank = (r: Requirement) => (r.importance === 'mandatory' ? 0 : 1);
        return rank(a) - rank(b);
      });
    return { category, items };
  }).filter((group) => group.items.length > 0);
}

/** Number of mandatory vs preferred requirements inside a group, for headings. */
export function importanceTally(items: readonly Requirement[]): {
  mandatory: number;
  preferred: number;
} {
  const mandatory = items.filter((r) => r.importance === 'mandatory').length;
  return { mandatory, preferred: items.length - mandatory };
}
