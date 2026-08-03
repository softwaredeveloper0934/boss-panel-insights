/**
 * Authz Provider — single source of truth for the current user's roles
 * and resolved permissions. Wire `useAuthzSource` to your Software Vala
 * `/me` endpoint when ready; until then it returns a configurable default.
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  permissionSetHas,
  resolvePermissions,
  type Permission,
  type Role,
} from "./permissions";

export interface AuthzUser {
  id?: string;
  name?: string;
  email?: string;
  roles: Role[];
  /** Optional explicit permission overrides (additive). */
  permissions?: Permission[];
}

interface AuthzContextValue {
  user: AuthzUser | null;
  isAuthenticated: boolean;
  hasRole: (role: Role | Role[]) => boolean;
  can: (permission: Permission | Permission[]) => boolean;
  cannot: (permission: Permission | Permission[]) => boolean;
}

const AuthzContext = createContext<AuthzContextValue | null>(null);

export interface AuthzProviderProps {
  /** Inject user from your backend; pass `null` for signed-out. */
  user?: AuthzUser | null;
  children: ReactNode;
}

/**
 * Until the backend session is wired, default to the workspace `owner`
 * (the Boss profile shown in the top bar). Every other role is fully
 * enforced by the module registry. Replace via the `user` prop.
 */
const DEFAULT_USER: AuthzUser = { roles: ["owner"] };

export function AuthzProvider({ user = DEFAULT_USER, children }: AuthzProviderProps) {
  const value = useMemo<AuthzContextValue>(() => {
    const roles = user?.roles ?? [];
    const set = resolvePermissions(roles);
    if (user?.permissions) for (const p of user.permissions) set.add(p);

    const can = (p: Permission | Permission[]) => {
      const list = Array.isArray(p) ? p : [p];
      return list.some((x) => permissionSetHas(set, x));
    };

    return {
      user: user ?? null,
      isAuthenticated: !!user,
      hasRole: (r) => {
        const list = Array.isArray(r) ? r : [r];
        return list.some((x) => roles.includes(x));
      },
      can,
      cannot: (p) => !can(p),
    };
  }, [user]);

  return <AuthzContext.Provider value={value}>{children}</AuthzContext.Provider>;
}

export function useAuthz(): AuthzContextValue {
  const ctx = useContext(AuthzContext);
  if (!ctx) {
    // Safe fallback so components don't crash if provider is missing.
    return {
      user: null,
      isAuthenticated: false,
      hasRole: () => false,
      can: () => false,
      cannot: () => true,
    };
  }
  return ctx;
}

/** Render children only if the user has the permission. */
export function Can({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission | Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { can } = useAuthz();
  return <>{can(permission) ? children : fallback}</>;
}
