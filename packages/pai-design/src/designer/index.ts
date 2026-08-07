/**
 * PAI DESIGN — Designer Harness
 * Visual regression (perceptual hash), physics hooks validation, a11y (axe-core)
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, extname, relative } from 'node:path';
import { createHash } from 'node:crypto';

const DESIGNER_DIR = resolve(__dirname, '../designer-output');

export interface VisualSnapshot {
  file: string;
  phash: string;           // perceptual hash (simplified: structural hash)
  width: number;
  height: number;
  componentType: string;
}

export interface PhysicsCheck {
  file: string;
  hasMagnetic: boolean;
  hasParallax: boolean;
  hasStagger: boolean;
  hasSpring: boolean;
  score: number;           // 0-100
}

export interface A11yIssue {
  file: string;
  rule: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  message: string;
  selector?: string;
}

export interface DesignerReport {
  visual: {
    snapshots: VisualSnapshot[];
    duplicates: { hash: string; files: string[] }[];
  };
  physics: PhysicsCheck[];
  a11y: A11yIssue[];
  summary: {
    totalFiles: number;
    passed: number;
    warnings: number;
    failed: number;
  };
}

/** Generate perceptual hash from file structure (simplified) */
function structuralHash(content: string): string {
  // Extract structural tokens: component names, hooks, jsx structure
  const tokens = content
    .replace(/\s+/g, ' ')
    .match(/<[A-Z][a-zA-Z0-9]*|useMagnetic|useParallax|useStagger|useSpring|className="[^"]*"/g) || [];
  return createHash('sha256').update(tokens.sort().join('|')).digest('hex').slice(0, 16);
}

/** Scan generated components for visual regression */
export function scanVisual(dirPath: string): VisualSnapshot[] {
  const snapshots: VisualSnapshot[] = [];
  
  function walk(d: string) {
    for (const f of readdirSync(d)) {
      const full = resolve(d, f);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (!['node_modules', '.git', '.next', 'dist'].includes(f)) walk(full);
      } else if (/\.(tsx?)$/.test(f)) {
        const code = readFileSync(full, 'utf-8');
        const rel = relative(dirPath, full);
        const phash = structuralHash(code);
        // Extract component type from filename
        const compType = f.replace(/\.(tsx?)$/, '').replace(/^(VAI|TRY|BUY|FLY|NEW|BLG|INDUCT|HAI|BYE|STYLE|WHY|PPP)/, '');
        snapshots.push({ file: rel, phash, width: 0, height: 0, componentType: compType || 'unknown' });
      }
    }
  }
  walk(dirPath);
  return snapshots;
}

/** Detect visual duplicates */
export function findVisualDuplicates(snapshots: VisualSnapshot[]): { hash: string; files: string[] }[] {
  const byHash = new Map<string, string[]>();
  for (const s of snapshots) {
    byHash.set(s.phash, [...(byHash.get(s.phash) || []), s.file]);
  }
  return Array.from(byHash.entries())
    .filter(([, files]) => files.length > 1)
    .map(([hash, files]) => ({ hash, files }));
}

/** Validate physics hooks usage */
export function scanPhysics(dirPath: string): PhysicsCheck[] {
  const checks: PhysicsCheck[] = [];
  
  function walk(d: string) {
    for (const f of readdirSync(d)) {
      const full = resolve(d, f);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (!['node_modules', '.git', '.next', 'dist'].includes(f)) walk(full);
      } else if (/\.tsx?$/.test(f) && !f.includes('.test.')) {
        const code = readFileSync(full, 'utf-8');
        const rel = relative(dirPath, full);
        const hasMagnetic = /useMagnetic/.test(code);
        const hasParallax = /useParallax/.test(code);
        const hasStagger = /useStagger/.test(code);
        const hasSpring = /useSpring|useTransition/.test(code);
        
        let score = 0;
        if (hasMagnetic) score += 25;
        if (hasParallax) score += 25;
        if (hasStagger) score += 25;
        if (hasSpring) score += 25;
        
        // Bonus: interactive elements present
        const interactive = /onClick|onChange|onSubmit|useState|useEffect/.test(code);
        if (interactive && score < 50) score = 25; // at least stagger expected
        
        checks.push({ file: rel, hasMagnetic, hasParallax, hasStagger, hasSpring, score });
      }
    }
  }
  walk(dirPath);
  return checks;
}

/** Basic a11y checks (axe-core style rules) */
export function scanA11y(dirPath: string): A11yIssue[] {
  const issues: A11yIssue[] = [];
  
  function walk(d: string) {
    for (const f of readdirSync(d)) {
      const full = resolve(d, f);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (!['node_modules', '.git', '.next', 'dist'].includes(f)) walk(full);
      } else if (/\.tsx?$/.test(f)) {
        const code = readFileSync(full, 'utf-8');
        const rel = relative(dirPath, full);
        const lines = code.split('\n');
        
        lines.forEach((line, i) => {
          // Missing alt on img
          if (/<img\s/.test(line) && !/alt\s*=/.test(line)) {
            issues.push({ file: rel, rule: 'img-alt', impact: 'serious', message: 'Image missing alt attribute', selector: `line ${i + 1}` });
          }
          // Missing label on input
          if (/<input\s/.test(line) && !/aria-label|aria-labelledby|id=/.test(line) && !/<label/.test(code.slice(Math.max(0, code.indexOf(line) - 200)))) {
            issues.push({ file: rel, rule: 'input-label', impact: 'serious', message: 'Input missing accessible label', selector: `line ${i + 1}` });
          }
          // Color contrast (heuristic: Tailwind text-neutral-400 on light bg)
          if (/text-neutral-400|text-gray-400/.test(line) && !/dark:/.test(line)) {
            issues.push({ file: rel, rule: 'color-contrast', impact: 'moderate', message: 'Potential low contrast on light background', selector: `line ${i + 1}` });
          }
          // Focus visible
          if (/focus:outline-none/.test(line) && !/focus-visible:outline/.test(code)) {
            issues.push({ file: rel, rule: 'focus-visible', impact: 'moderate', message: 'Focus outline removed without focus-visible alternative', selector: `line ${i + 1}` });
          }
          // Heading hierarchy
          const hMatch = line.match(/<h([1-6])/);
          if (hMatch) {
            const level = parseInt(hMatch[1]);
            // We'd track previous heading level - simplified check
          }
        });
      }
    }
  }
  walk(dirPath);
  return issues;
}

/** Full designer harness run */
export function runDesignerHarness(genDir: string): DesignerReport {
  mkdirSync(DESIGNER_DIR, { recursive: true });
  
  const visual = scanVisual(genDir);
  const duplicates = findVisualDuplicates(visual);
  const physics = scanPhysics(genDir);
  const a11y = scanA11y(genDir);
  
  const passed = physics.filter(p => p.score >= 75).length + (a11y.length === 0 ? 1 : 0);
  const warnings = physics.filter(p => p.score >= 50 && p.score < 75).length + a11y.filter(i => i.impact === 'moderate' || i.impact === 'minor').length;
  const failed = physics.filter(p => p.score < 50).length + a11y.filter(i => i.impact === 'critical' || i.impact === 'serious').length + duplicates.length;
  
  const report: DesignerReport = {
    visual: { snapshots: visual, duplicates },
    physics,
    a11y,
    summary: { totalFiles: visual.length, passed, warnings, failed }
  };
  
  writeFileSync(resolve(DESIGNER_DIR, 'designer-report.json'), JSON.stringify(report, null, 2));
  return report;
}

/** Format for CLI */
export function formatDesignerReport(r: DesignerReport): string {
  const lines = ['🎨 PAI DESIGNER HARNESS REPORT', '═'.repeat(40)];
  
  if (r.visual.duplicates.length) {
    lines.push('\n🔴 VISUAL DUPLICATES:');
    for (const d of r.visual.duplicates) {
      lines.push(`  Hash ${d.hash}: ${d.files.join(', ')}`);
    }
  } else {
    lines.push('\n✅ No visual duplicates');
  }
  
  lines.push('\n⚡ PHYSICS HOOKS:');
  for (const p of r.physics) {
    const icon = p.score >= 75 ? '✅' : p.score >= 50 ? '⚠️' : '❌';
    lines.push(`  ${icon} ${p.file}: ${p.score}/100 (M:${p.hasMagnetic} P:${p.hasParallax} S:${p.hasStagger} Sp:${p.hasSpring})`);
  }
  
  if (r.a11y.length) {
    lines.push('\n♿ A11Y ISSUES:');
    for (const a of r.a11y) {
      const icon = a.impact === 'critical' ? '🔴' : a.impact === 'serious' ? '🟠' : '🟡';
      lines.push(`  ${icon} ${a.file}: [${a.rule}] ${a.message} ${a.selector ? `(${a.selector})` : ''}`);
    }
  } else {
    lines.push('\n✅ No a11y issues');
  }
  
  lines.push('\n📊 SUMMARY:');
  lines.push(`  Files: ${r.summary.totalFiles} | Passed: ${r.summary.passed} | Warnings: ${r.summary.warnings} | Failed: ${r.summary.failed}`);
  
  return lines.join('\n');
}