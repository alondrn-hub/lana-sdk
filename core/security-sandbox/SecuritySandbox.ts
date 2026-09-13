/**
 * Lana SDK - Enterprise Security Sandbox
 */
export class SecuritySandbox {
  private allowedPermissions: Set<string> = new Set(['read:sensors', 'execute:tools', 'net:outbound']);

  verifyPermission(permission: string): boolean {
    return this.allowedPermissions.has(permission);
  }

  assertPermission(permission: string) {
    if (!this.verifyPermission(permission)) {
      throw new Error(`Security Violation: Permission '${permission}' denied.`);
    }
  }
}
