/**
 * PAI DESIGN — Template Generator
 * Renders endpoint schemas → complete Next.js pages with MagicUI physics hooks
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ValidationResult } from '../validator';

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

const CURRENT_DIR = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));

function resolveTemplateDir(): string {
  const candidates = [
    resolve(CURRENT_DIR, '../templates'),
    resolve(CURRENT_DIR, '../../src/templates'),
  ];
  return candidates.find(dir => existsSync(dir)) ?? candidates[0];
}

const TEMPLATE_DIR = resolveTemplateDir();

function resolvePath(data: Record<string, unknown>, expr: string): unknown {
  if (expr === 'this') return data.this;
  if (expr === '@index') return data['@index'];
  const segments = expr.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current: unknown = data;
  for (const seg of segments) {
    if (current == null) return undefined;
    if (seg === 'toUpperCase' && typeof current === 'string') {
      current = current.toUpperCase();
      continue;
    }
    if (seg === 'length' && (Array.isArray(current) || typeof current === 'string')) {
      current = current.length;
      continue;
    }
    if (Array.isArray(current)) {
      const idx = Number(seg);
      current = Number.isInteger(idx) ? current[idx] : undefined;
    } else if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return current;
}

/** Handlebars-style simple template renderer (zero-dep) */
function render(template: string, data: Record<string, unknown>): string {
  return template
    .replace(/\{\{#each ([\w.[\]]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, block) => {
      const arr = resolvePath(data, key);
      if (!Array.isArray(arr)) return '';
      return arr
        .map((item, idx) => {
          const itemScope: Record<string, unknown> =
            item !== null && typeof item === 'object'
              ? { ...data, ...(item as Record<string, unknown>), this: item, '@index': idx }
              : { ...data, this: item, '@index': idx };
          return block.replace(/\{\{([@\w.[\]]+)\}\}/g, (_: string, expr: string) =>
            String(resolvePath(itemScope, expr) ?? '')
          );
        })
        .join('');
    })
    .replace(/\{\{#if ([\w.[\]]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g, (_, key, block, elseBlock = '') =>
      resolvePath(data, key) ? block : elseBlock
    )
    .replace(/\{\{([@\w.[\]]+)\}\}/g, (_, expr) => String(resolvePath(data, expr) ?? ''));
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
  const files: { path: string; template: string; isClient: boolean; route?: Route }[] = [
    { path: 'page.tsx', template: 'page', isClient: false },
    { path: 'layout.tsx', template: 'layout', isClient: false },
    { path: `components/${schema.endpoint.toUpperCase()}Hero.tsx`, template: 'hero', isClient: true },
    { path: `components/${schema.endpoint.toUpperCase()}Stats.tsx`, template: 'stats', isClient: true },
    { path: `components/${schema.endpoint.toUpperCase()}Features.tsx`, template: 'features', isClient: true },
    { path: `components/${schema.endpoint.toUpperCase()}Cta.tsx`, template: 'cta', isClient: true },
  ];

  // Sub-route pages
  for (const route of schema.routes) {
    const routeDir = route.path.replace(/^\/+/, '').replace(/\/+$/, '');
    if (routeDir) {
      files.push({ path: `${routeDir}/page.tsx`, template: 'sub-route', isClient: true, route });
    }
  }

  for (const f of files) {
    const fullPath = resolve(baseDir, f.path);
    if (!fullPath.startsWith(baseDir + sep)) {
      return {
        valid: false,
        errors: [{ path: f.path, message: 'Resolved output path escapes endpoint directory', severity: 'error', code: 'PATH_TRAVERSAL' }],
        warnings: results.warnings,
      };
    }
    const dir = dirname(fullPath);
    mkdirSync(dir, { recursive: true });

    if (existsSync(fullPath) && !force) {
      results.warnings.push({ path: f.path, message: 'File exists (use --force to overwrite)', code: 'EXISTS' });
      continue;
    }

    const firstRoute = schema.routes[0]?.path ?? '/';
    const normalizedFirstRoute = firstRoute === '/' ? '' : '/' + firstRoute.replace(/^\/+|\/+$/g, '');
    const pageTitleBase = schema.i18n?.en?.hero_title ?? schema.name;
    const routeTitle = f.route ? f.route.title : schema.name;
    const templateData = {
      ...schema,
      route: f.route,
      componentName: f.route ? f.route.component : `${schema.endpoint.toUpperCase()}Page`,
      isClient: f.isClient,
      color: schema.color,
      routes: schema.routes,
      skills: schema.skills,
      i18n: schema.i18n,
      primaryRouteSuffix: normalizedFirstRoute,
      nameLiteral: JSON.stringify(schema.name),
      descriptionLiteral: JSON.stringify(schema.description),
      layerLiteral: JSON.stringify(schema.layer),
      routeTitleLiteral: JSON.stringify(routeTitle),
      subRouteMetaTitleLiteral: JSON.stringify(`${routeTitle} | ${schema.name}`),
      pageTitleLiteral: JSON.stringify(`${pageTitleBase} | PAI`),
      enTitleLiteral: JSON.stringify(pageTitleBase),
      enSubtitleLiteral: JSON.stringify(schema.i18n?.en?.hero_subtitle ?? schema.description),
      featuresLiteral: JSON.stringify(
        schema.skills.map(skill => ({
          title: skill,
          description: `Enterprise-grade ${skill} with zero-knowledge proofs.`,
          icon: '🔐',
        })),
      ),
    };

    const content = render(loadTemplate(f.template), templateData);
    writeFileSync(fullPath, content, 'utf-8');
  }

  return results;
}

function validateSchemaFromObject(schema: EndpointSchema): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];
  if (!/^[a-z]{3,8}$/.test(schema.endpoint)) {
    errors.push({ path: '/endpoint', message: 'Endpoint must match ^[a-z]{3,8}$', severity: 'error', code: 'INVALID_ENDPOINT' });
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(schema.color)) {
    errors.push({ path: '/color', message: 'Color must be a 6-digit hex code (#RRGGBB)', severity: 'error', code: 'INVALID_COLOR' });
  }
  if (!schema.routes.length) {
    errors.push({ path: '/routes', message: 'At least one route required', severity: 'error', code: 'NO_ROUTES' });
  }
  for (const route of schema.routes) {
    if (route.path.split('/').some(seg => seg === '..')) {
      errors.push({ path: `/routes`, message: `Invalid route path: ${route.path}`, severity: 'error', code: 'INVALID_ROUTE_PATH' });
    }
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(route.component)) {
      errors.push({ path: `/routes`, message: `Invalid component identifier: ${route.component}`, severity: 'error', code: 'INVALID_COMPONENT' });
    }
  }
  return { valid: errors.length === 0, errors, warnings };
}

/** List available templates */
export function listTemplates(): string[] {
  return readdirSync(TEMPLATE_DIR)
    .filter(f => f.endsWith('.hbs'))
    .map(f => f.replace('.hbs', ''));
}