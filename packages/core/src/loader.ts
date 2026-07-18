export class SkillLoader {
  async load(manifest: any, context: any): Promise<any> {
    const module = await import(manifest.entryPoint);
    const skill = module[manifest.mainExport || 'default'];
    if (!skill) {
      throw new Error(`Skill ${manifest.name}: export "${manifest.mainExport || 'default'}" not found`);
    }
    return typeof skill === 'function' ? skill(context) : skill;
  }
}
