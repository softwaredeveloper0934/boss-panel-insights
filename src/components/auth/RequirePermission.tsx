import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

import { PageShell } from "@/components/layout/PageShell";
import { useAuthz } from "@/lib/rbac/AuthzProvider";
import type { Permission } from "@/lib/rbac/permissions";

/**
 * Wrap a page (or any region) to gate it behind an RBAC permission.
 * Unauthorized users see a premium 403 panel — never the data.
 */
export function RequirePermission({
  permission,
  children,
}: {
  permission: Permission | Permission[];
  children: ReactNode;
}) {
  const { can, isAuthenticated } = useAuthz();
  if (can(permission)) return <>{children}</>;

  return (
    <PageShell>
      <div className="bento-card flex flex-col items-center justify-center text-center py-20 px-6">
        <div className="grid place-items-center h-14 w-14 rounded-2xl bg-destructive/15 text-destructive mb-5">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Access restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          {isAuthenticated
            ? "Your role does not include permission to view this module. Contact your workspace owner to request access."
            : "Sign in with a Software Vala account that has access to this module."}
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
          Required:{" "}
          <code className="font-mono text-foreground/80">
            {Array.isArray(permission) ? permission.join(" · ") : permission}
          </code>
        </p>
      </div>
    </PageShell>
  );
}
