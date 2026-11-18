import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateSchema } from '../src/validator';
import { generateEndpoint } from '../src/generator';
import { findVisualDuplicates, scanA11y, scanVisual } from '../src/designer';

describe('pai-design validator, generator, and designer harness', () => {
  it('validates schema via Ajv draft 2020-12 and warns on missing i18n title', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pai-design-val-'));
    try {
      const schemaFile = join(dir, 'vai.yml');
      writeFileSync(
        schemaFile,
        `endpoint: vai
layer: L1
name: VAI
arabic: هوية
description: Identity endpoint
color: "#BDFF23"
routes:
  - path: /
    component: VAIPage
    title: Home
skills:
  - did
i18n:
  en:
    hero_title: VAI
    hero_subtitle: Sovereign identity
  ar:
    hero_title: ""
    hero_subtitle: هوية سيادية
  zh:
    hero_title: VAI
    hero_subtitle: 主权身份
`,
        'utf-8',
      );
      const result = validateSchema(schemaFile);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings.some(w => w.code === 'MISSING_I18N')).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects traversal endpoints before writing any files', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pai-design-sec-'));
    try {
      const res = generateEndpoint(
        {
          endpoint: '../../evil',
          layer: 'L1',
          name: 'Evil',
          arabic: 'اختبار',
          description: 'Invalid traversal endpoint',
          color: '#000000',
          routes: [{ path: '/', component: 'Home', title: 'Home' }],
          skills: [],
          i18n: { en: { hero_title: 'Bad', hero_subtitle: 'Bad' } },
        },
        dir,
        true,
      );
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.code === 'INVALID_ENDPOINT')).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('generates pages, sub-routes, dotted expressions, and runtime JSX loops', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pai-design-gen-'));
    try {
      const res = generateEndpoint(
        {
          endpoint: 'vai',
          layer: 'L1',
          name: 'VAI',
          arabic: 'هوية',
          description: 'Sovereign identity',
          color: '#BDFF23',
          routes: [
            { path: '/', component: 'VAIPage', title: 'Home' },
            { path: '/about', component: 'AboutPage', title: 'About VAI' },
          ],
          skills: ['did', 'kyc'],
          i18n: {
            en: {
              hero_title: 'Sovereign Identity',
              hero_subtitle: 'Zero-knowledge human verification',
              cta_text: 'Launch',
            },
          },
        },
        dir,
        true,
      );
      expect(res.valid).toBe(true);
      const pageTsx = readFileSync(join(dir, '[locale]/vai/page.tsx'), 'utf-8');
      expect(pageTsx).toContain("title: 'Sovereign Identity | PAI'");
      expect(pageTsx).not.toContain('{{i18n.en.hero_title}}');
      const heroTsx = readFileSync(join(dir, '[locale]/vai/components/VAIHero.tsx'), 'utf-8');
      expect(heroTsx).toContain('href="/"');
      expect(heroTsx).not.toContain('{{routes[0].path}}');
      const featuresTsx = readFileSync(join(dir, '[locale]/vai/components/VAIFeatures.tsx'), 'utf-8');
      expect(featuresTsx).toContain("title: 'did'");
      expect(featuresTsx).toContain('{features.map((feature, index) => (');
      const statsTsx = readFileSync(join(dir, '[locale]/vai/components/VAIStats.tsx'), 'utf-8');
      expect(statsTsx).toContain("value: '2'");
      expect(statsTsx).toContain('{stats.map((stat, index) => (');
      const aboutTsx = readFileSync(join(dir, '[locale]/vai/about/page.tsx'), 'utf-8');
      expect(aboutTsx).toContain('export default function AboutPage()');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('respects multiline <img> alt attributes and avoids false duplicates on lowercase/empty TSX files', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pai-design-a11y-'));
    try {
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, 'Button.tsx'),
        'export function Btn() { return <button>Save</button>; }\n',
        'utf-8',
      );
      writeFileSync(
        join(dir, 'Logo.tsx'),
        'export function Logo() {\n  return (\n    <img\n      src="/logo.png"\n      alt="PAI Logo"\n    />\n  );\n}\n',
        'utf-8',
      );
      writeFileSync(join(dir, 'helpers.ts'), 'export const VERSION = "1.0.0";\n', 'utf-8');
      writeFileSync(join(dir, 'constants.ts'), 'export const NAME = "PAI";\n', 'utf-8');

      const a11yIssues = scanA11y(dir);
      expect(a11yIssues.filter(i => i.rule === 'img-alt')).toHaveLength(0);

      const snapshots = scanVisual(dir);
      const duplicates = findVisualDuplicates(snapshots);
      expect(duplicates).toHaveLength(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
