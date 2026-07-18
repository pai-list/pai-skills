import { SkillLoader } from './loader.js';

export class SkillRegistry {
  private skills = new Map<string, any>();
  private instances = new Map<string, unknown>();
  private loader = new SkillLoader();
  private listeners = new Map<string, Array<(...args: any[]) => void>>();

  private emit(event: string, ...args: any[]) {
    const handlers = this.listeners.get(event);
    if (handlers) handlers.forEach(h => h(...args));
  }

  on(event: string, handler: (...args: any[]) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(handler);
  }

  register(manifest: any): void {
    if (this.skills.has(manifest.name)) {
      throw new Error(`Skill ${manifest.name} already registered`);
    }
    this.skills.set(manifest.name, manifest);
    this.emit('registered', manifest);
  }

  get(name: string) {
    return this.skills.get(name);
  }

  list(): any[] {
    return Array.from(this.skills.values());
  }

  search(query: string, options: {
    category?: string;
    tag?: string;
    verified?: boolean;
    page?: number;
    pageSize?: number;
  } = {}): { skills: any[]; total: number; page: number; pageSize: number } {
    const { category, tag, verified, page = 1, pageSize = 20 } = options;
    const q = query.toLowerCase();

    let results = Array.from(this.skills.values()).filter(skill => {
      if (query && !skill.name.toLowerCase().includes(q) &&
          !skill.description.toLowerCase().includes(q)) {
        return false;
      }
      if (category && skill.category !== category) return false;
      if (tag && skill.tags && !skill.tags.includes(tag)) return false;
      if (verified !== undefined && skill.verified !== verified) return false;
      return true;
    });

    results.sort((a, b) => {
      if (a.verified !== b.verified) return b.verified ? 1 : -1;
      return (b.downloads || 0) - (a.downloads || 0);
    });

    const total = results.length;
    const start = (page - 1) * pageSize;
    const skills = results.slice(start, start + pageSize);
    return { skills, total, page, pageSize };
  }

  stats() {
    const skills = Array.from(this.skills.values());
    return {
      totalSkills: skills.length,
      totalDownloads: skills.reduce((sum, s) => sum + (s.downloads || 0), 0),
      totalAuthors: new Set(skills.map(s => s.author)).size,
      categories: skills.reduce((acc, s) => {
        const cat = s.category || 'uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  async load(skillName: string, context: any): Promise<any> {
    const manifest = this.skills.get(skillName);
    if (!manifest) throw new Error(`Skill ${skillName} not found`);

    const instanceKey = `${manifest.name}@${manifest.version}`;
    if (this.instances.has(instanceKey)) return this.instances.get(instanceKey);

    const skill = await this.loader.load(manifest, context);
    this.instances.set(instanceKey, skill);
    this.emit('loaded', { name: skillName, skill });
    return skill;
  }

  async unload(skillName: string): Promise<void> {
    for (const [key, skill] of this.instances) {
      if (key.startsWith(skillName + '@')) {
        if (typeof (skill as any).cleanup === 'function') {
          await (skill as any).cleanup();
        }
        this.instances.delete(key);
        this.emit('unloaded', skillName);
      }
    }
  }
}

export const globalRegistry = new SkillRegistry();
