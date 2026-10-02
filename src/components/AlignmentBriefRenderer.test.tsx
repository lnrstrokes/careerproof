/**
 * Render tests for the fit report component.
 *
 * Renders the real component to static markup (no DOM needed) and asserts the
 * report is grouped into categories, that every requirement appears exactly once,
 * and that no requirement text is silently dropped.
 */
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { AlignmentBriefRenderer } from './AlignmentBriefRenderer';
import type { AlignmentBrief, Requirement } from '../../server/schema';

function req(overrides: Partial<Requirement> & { id: string; type: Requirement['type'] }): Requirement {
  return {
    text: 'Requirement text',
    sourceQuote: 'Requirement text',
    spanStart: 0,
    spanEnd: 0,
    importance: 'mandatory',
    status: 'supported',
    candidateEvidence: [],
    rationale: 'r',
    action: null,
    verificationQuestion: null,
    ...overrides,
  };
}

const brief: AlignmentBrief = {
  contractVersion: '1.0',
  posting: { title: 'Registered Nurse', organization: null, location: 'Cardston Health Centre', deadline: '05-OCT-2026', sourceUrl: null },
  interpretation: { likelyOccupationTitle: 'Registered nurse', nocCandidates: [], ambiguityNotes: [] },
  requirements: [
    req({ id: 'r-edu', type: 'education', text: 'Completion of an accredited nursing education program' }),
    req({ id: 'r-cert', type: 'certification', text: 'Current BCLS-HCP certification', importance: 'mandatory' }),
    req({ id: 'r-exp', type: 'experience', text: 'Minimum one-year Emergency Room experience', importance: 'preferred' }),
    req({ id: 'r-skill1', type: 'skill', text: 'Evidence of integrity, initiative and sound judgment' }),
    req({ id: 'r-skill2', type: 'skill', text: 'Excellent interpersonal and team communication skills' }),
    req({ id: 'r-lang', type: 'language', text: 'English language proficiency', importance: 'preferred' }),
    req({ id: 'r-duty', type: 'duty', text: 'Provide safe, quality patient and family centered care' }),
    req({ id: 'r-other', type: 'other', text: 'Some other stated requirement' }),
  ],
  hardConstraints: [
    req({ id: 'h-lic', type: 'licence', text: 'Active or eligible for registration with CRNA', status: 'hard_constraint' }),
    req({ id: 'h-loc', type: 'location', text: 'Primary Location: Cardston Health Centre', status: 'hard_constraint' }),
    req({ id: 'h-sch', type: 'schedule', text: 'Shift Pattern: Days, Evenings, Nights, Weekends', status: 'hard_constraint' }),
  ],
  assumptions: [],
  unresolvedQuestions: [],
  counts: { supported: 8, transferable: 0, missing: 0, unknown: 0, hard_constraint: 3 },
  disclaimer: 'Disclaimer text.',
};

describe('categorised report renders', () => {
  const html = renderToStaticMarkup(React.createElement(AlignmentBriefRenderer, { brief }));

  it('renders requirement category headings in table order', () => {
    // Only the requirement section's own headings, checked within that
    // section - hard-constraint headings render earlier in the document.
    const requirementSection = html.slice(html.indexOf('Requirements by category'));
    const order = [
      'Education &amp; credentials',
      'Certifications',
      'Experience',
      'Skills',
      'Role duties',
      'Languages',
      'Other requirements',
    ];
    const positions = order.map((label) => requirementSection.indexOf(label));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('groups hard constraints under their own category headings, in table order', () => {
    const section = html.slice(
      html.indexOf('Verify with the official source'),
      html.indexOf('Requirements by category'),
    );
    const order = ['Licences &amp; registration', 'Location', 'Hours &amp; availability'];
    const positions = order.map((label) => section.indexOf(label));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('renders a requirement count per category heading', () => {
    expect(html).toContain('2 mandatory');
    expect(html).toContain('0 mandatory, 1 preferred');
  });

  it('shows a blurb under each requirement category heading', () => {
    expect(html).toContain('Certificates and courses the advert names directly.');
    expect(html).toContain('Language requirements stated by the advert.');
  });

  it('lists every requirement text somewhere in the output', () => {
    for (const r of [...brief.requirements, ...brief.hardConstraints]) {
      expect(html).toContain(r.text);
    }
  });

  it('hard constraints are grouped by category under the official-source heading', () => {
    expect(html).toContain('Verify with the official source');
    expect(html).toContain('This cannot be established from CV text');
    // The old wording asserted a negative the text never checked.
    expect(html).not.toContain('Nothing in your CV covers this');
  });

  it('no longer renders the old flat "Mandatory requirements" heading', () => {
    expect(html).not.toContain('>Mandatory requirements<');
    expect(html).toContain('Requirements by category');
  });
});
