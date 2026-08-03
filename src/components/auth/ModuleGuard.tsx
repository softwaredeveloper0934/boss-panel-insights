import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { RequirePermission } from "@/components/auth/RequirePermission";
import { permissionForPath } from "@/lib/rbac/module-access";

/**
 * App-wide RBAC gate. Resolves the current route to its module permission
 * and renders the 403 panel instead of the module when the user lacks it.
 * Unmapped routes (404 etc.) render normally.
 */
export function ModuleGuard({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const permission = permissionForPath(pathname);
  if (!permission) return <>{children}</>;
  return <RequirePermission permission={permission}>{children}</RequirePermission>;
}
