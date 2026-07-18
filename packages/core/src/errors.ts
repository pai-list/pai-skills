export class PaiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown,
    public retryable = false
  ) {
    super(message);
    this.name = 'PaiError';
  }
}

export class SkillNotFoundError extends PaiError {
  constructor(name: string) {
    super('SKILL_404', `Skill "${name}" not found`, { name });
  }
}

export class SkillValidationError extends PaiError {
  constructor(message: string, details?: unknown) {
    super('SKILL_400', message, details);
  }
}

export class PermissionDeniedError extends PaiError {
  constructor(permission: string) {
    super('SKILL_403', `Missing permission: ${permission}`, { permission });
  }
}
