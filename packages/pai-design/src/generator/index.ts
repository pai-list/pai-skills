/**
 * PAI DESIGN — Template Generator
 * Renders endpoint schemas → complete Next.js pages with MagicUI physics hooks
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import yaml from 'yaml';
import { validateSchema, ValidationResult } from './validator';

export interface EndpointSchema {
  endpoint: string;
  layer: string;
  name: string;
  arabic: string;
  description: string;
  color: string;
  routes: Route[];
  skills: string[];
  i18n: Record<string, { hero_title: string; hero_subtitle: string; cta_text?: string }>;
}

export interface Route {
  path: string;
  component: string;
  title: string;
}

const TEMPLATE_DIR = resolve(__dirname, '../templates');

/** Handlebars-style simple template renderer (zero-dep) */
function render(template: string, data: Record<string, unknown>): string {
  return template
    .replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, block) => {
      const arr = (data[key] as unknown[]) || [];
      return arr.map(item => block.replace(/\{\{(\w+)\}\}/g, (__, prop) => String((item as Record<string, unknown>)[prop] ?? ''))).join('');
    })
    .replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, block) => data[key] ? block : '')
    .replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? ''));
}

/** Load template file */
function loadTemplate(name: string): string {
  const path = resolve(TEMPLATE_DIR, `${name}.hbs`);
  if (!existsSync(path)) throw new Error(`Template not found: ${name}`);
  return readFileSync(path, 'utf-8');
}

/** Generate full endpoint page tree from schema */
export function generateEndpoint(schema: EndpointSchema, outputDir: string, force = false): ValidationResult {
  const baseDir = resolve(outputDir, `[locale]`, schema.endpoint);
  const results: ValidationResult = { valid: true, errors: [], warnings: [] };

  // Validate first
  const validation = validateSchemaFromObject(schema);
  if (!validation.valid) return validation;

  // Generate files
  const files = [
    { path: 'page.tsx', template: 'page', isClient: false },
    { path: 'layout.tsx', template: 'layout', isClient: false },
    { path: `components/${schema.endpoint.toUpperCase()}Hero.tsx`, template: 'hero', isClient: true },
    { path: `components/${schema.endpoint.toUpperCase()}Stats.tsx`, template: 'stats', isClient: true },
    { path: `components/${schema.endpoint.toUpperCase()}Features.tsx`, template: 'features', isClient: true },
    { path: `components/${schema.endpoint.toUpperCase()}Cta.tsx`, template: 'cta', isClient: true },
  ];

  // Sub-route pages
  for (const route of schema.routes) {
    const routeDir = route.path.replace(/^\//, '').replace(/\//g, '/');
    if (routeDir) {
      files.push({ path: `${routeDir}/page.tsx`, template: 'sub-route', isClient: true, route });
    }
  }

  for (const f of files) {
    const fullPath = resolve(baseDir, f.path);
    const dir = dirname(fullPath);
    mkdirSync(dir, { recursive: true });

    if (existsSync(fullPath) && !force) {
      results.warnings.push({ path: f.path, message: 'File exists (use --force to overwrite)', code: 'EXISTS' });
      continue;
    }

    const templateData = {
      ...schema,
      route: f.route,
      componentName: f.route ? f.route.component : `${schema.endpoint.toUpperCase()}Page`,
      isClient: f.isClient,
      color: schema.color,
      routes: schema.routes,
      skills: schema.skills,
      i18n: schema.i18n,
    };

    const content = render(loadTemplate(f.template), templateData);
    writeFileSync(fullPath, content, 'utf-8');
  }

  return results;
}

function validateSchemaFromObject(schema: EndpointSchema): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];
  if (!schema.routes.length) errors.push({ path: '/routes', message: 'At least one route required', severity: 'error', code: 'NO_ROUTES' });
  return { valid: errors.length === 0, errors, warnings };
}

/** List available templates */
export function listTemplates(): string[] {
  return readdirSync(TEMPLATE_DIR)
    .filter(f => f.endsWith('.hbs'))
    .map(f => f.replace('.hbs', ''));
}