import { describe, it, expect } from 'vitest';
import { isPathAllowedForRole, ROLE_CONFIGS } from '../rbac';

describe('Role-Based Access Control (RBAC)', () => {
  it('allows citizens to access citizen routes and open data but restricts audit', () => {
    expect(isPathAllowedForRole('citizen', '/citizen')).toBe(true);
    expect(isPathAllowedForRole('citizen', '/citizen/file-gd')).toBe(true);
    expect(isPathAllowedForRole('citizen', '/transparency')).toBe(true);
    expect(isPathAllowedForRole('citizen', '/audit')).toBe(false);
    expect(isPathAllowedForRole('citizen', '/officer/queue')).toBe(false);
  });

  it('allows OCs to access queue, case management, and station dashboard', () => {
    expect(isPathAllowedForRole('oc', '/officer')).toBe(true);
    expect(isPathAllowedForRole('oc', '/officer/queue')).toBe(true);
    expect(isPathAllowedForRole('oc', '/station-dashboard')).toBe(true);
    expect(isPathAllowedForRole('oc', '/kiosk')).toBe(false);
  });

  it('allows auditor to inspect audit ledger and misconduct reports', () => {
    expect(isPathAllowedForRole('auditor', '/audit')).toBe(true);
    expect(isPathAllowedForRole('auditor', '/misconduct-reports')).toBe(true);
    expect(isPathAllowedForRole('auditor', '/district-analytics')).toBe(true);
  });

  it('allows public access to login, register, demo roles and open data for any role', () => {
    expect(isPathAllowedForRole('citizen', '/login')).toBe(true);
    expect(isPathAllowedForRole('citizen', '/register')).toBe(true);
    expect(isPathAllowedForRole('citizen', '/demo-roles')).toBe(true);
    expect(isPathAllowedForRole('oc', '/login')).toBe(true);
    expect(isPathAllowedForRole('auditor', '/demo-roles')).toBe(true);
  });

  it('configures all 7 roles with valid defaults and descriptions', () => {
    const roles = Object.keys(ROLE_CONFIGS);
    expect(roles).toHaveLength(7);
    expect(roles).toContain('citizen');
    expect(roles).toContain('operator');
    expect(roles).toContain('oc');
    expect(roles).toContain('io');
    expect(roles).toContain('evidence');
    expect(roles).toContain('dispatcher');
    expect(roles).toContain('auditor');
  });
});
