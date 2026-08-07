/**
 * PAI DESIGN — Schema Validator
 * Validates endpoint schemas + generated code for gaps, duplications, security issues
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, extname, relative } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'yaml';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const SCHEMA_PATH = resolve(__dirname, '../schemas/endpoint-schema.json');
const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf-8'));
const validate = ajv.compile(schema);

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}

/** Validate a single endpoint schema YAML file */
export function validateSchema(schemaPath: string): ValidationResult {
  const content = readFileSync(schemaPath, 'utf-8');
  const data = yaml.parse(content);
  const valid = validate(data);
  const errors: ValidationError[] = (validate.errors || []).map(e => ({
    path: e.instancePath || '/',
    message: e.message || 'Invalid',
    severity: 'error' as const,
    code: e.keyword || 'schema'
  }));
  const warnings: ValidationWarning[] = [];
  // Custom semantic checks
  if (data.routes) {
    const comps = new Set<string>();
    for (const r of data.routes) {
      if (comps.has(r.component)) {
        warnings.push({ path: `/routes/${r.component}`, message: `Duplicate component name: ${r.component}`, code: 'DUP_COMPONENT' });
      }
      comps.add(r.component);
    }
    // Check for missing common routes
    const paths = data.routes.map(r => r.path);
    if (!paths.some(p => p === '/' || p.endsWith('/'))) {
      warnings.push({ path: '/routes', message: 'No root route (/) defined', code: 'MISSING_ROOT' });
    }
  }
  if (data.i18n) {
    for (const lang of ['en', 'ar', 'zh']) {
      if (!data.i18n[lang]?.hero_title) {
        warnings.push({ path: `/i18n/${lang}`, message: `Missing hero_title for ${lang}`, code: 'MISSING_I18N' });
      }
    }
  }
  return { valid, errors, warnings };
}

/** Validate generated TypeScript/TSX for common issues */
export function validateGeneratedCode(dirPath: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  function walk(d: string) {
    for (const f of readdirSync(d)) {
      const full = resolve(d, f);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (!['node_modules', '.git', '.next', 'dist'].includes(f)) walk(full);
      } else if (/\.(ts|tsx)$/.test(f)) {
        const code = readFileSync(full, 'utf-8');
        const rel = relative(dirPath, full);
        checkFile(rel, code, errors, warnings);
      }
    }
  }
  walk(dirPath);
  return { valid: errors.length === 0, errors, warnings };
}

function checkFile(rel: string, code: string, errors: ValidationError[], warnings: ValidationWarning[]) {
  const lines = code.split('\n');
  // Security: no dangerouslySetInnerHTML without sanitization
  if (code.includes('dangerouslySetInnerHTML')) {
    const hasSanitize = code.includes('DOMPurify') || code.includes('sanitize') || code.includes('escapeHtml');
    if (!hasSanitize) {
      errors.push({ path: rel, message: 'dangerouslySetInnerHTML without sanitization', severity: 'error', code: 'XSS_RISK' });
    }
  }
  // Security: no eval/Function constructor
  if (/\beval\(|\bFunction\(/.test(code)) {
    errors.push({ path: rel, message: 'eval/Function constructor usage', severity: 'error', code: 'CODE_INJECTION' });
  }
  // Gap: missing error boundary for client components
  if (code.includes('"use client"') && !code.includes('ErrorBoundary')) {
    warnings.push({ path: rel, message: 'Client component missing ErrorBoundary', code: 'MISSING_ERROR_BOUNDARY' });
  }
  // Gap: physics hooks not used in interactive components
  const hasInteractive = /onClick|onChange|onSubmit|useState|useEffect/.test(code);
  const hasPhysics = /useMagnetic|useParallax|useStagger|useSpring/.test(code);
  if (hasInteractive && !hasPhysics && !rel.includes('.test.')) {
    warnings.push({ path: rel, message: 'Interactive component missing physics hooks', code: 'MISSING_PHYSICS' });
  }
  // Duplicate: identical component files
  if (code.length > 500 && lines.length > 30) {
    // Just flag for manual review
    warnings.push({ path: rel, message: 'Large component — check for duplication', code: 'LARGE_COMPONENT' });
  }
  // TypeScript: explicit any
  if (/\bany\b/.test(code) && !code.includes('@ts-expect-error')) {
    warnings.push({ path: rel, message: 'Explicit any type used', code: 'EXPLICIT_ANY' });
  }
}

/** Validate entire project: schemas + generated code */
export function validateProject(schemaDir: string, genDir?: string): ValidationResult {
  const allErrors: ValidationResult = { valid: true, errors: [], warnings: [] };
  for (const f of readdirSync(schemaDir)) {
    if (f.endsWith('.yaml') || f.endsWith('.yml')) {
      const r = validateSchema(resolve(schemaDir, f));
      allErrors.errors.push(...r.errors);
      allErrors.warnings.push(...r.warnings);
      if (!r.valid) allErrors.valid = false;
    }
  }
  if (genDir) {
    const r = validateGeneratedCode(genDir);
    allErrors.errors.push(...r.errors);
    allErrors.warnings.push(...r.warnings);
    if (!r.valid) allErrors.valid = false;
  }
  return allErrors;
}

/** Format output for CLI */
export function formatResult(r: ValidationResult): string {
  const lines = [];
  if (r.errors.length) {
    lines.push('❌ ERRORS:');
    for (const e of r.errors) lines.push(`  ${e.path}: ${e.message} [${e.code}]`);
  }
  if (r.warnings.length) {
    lines.push('⚠️  WARNINGS:');
    for (const w of r.warnings) lines.push(`  ${w.path}: ${w.message} [${w.code}]`);
  }
  if (!r.errors.length && !r.warnings.length) lines.push('✅ All checks passed');
  lines.push(`\nValid: ${r.valid}`);
  return lines.join('\n');
}