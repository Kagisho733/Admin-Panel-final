import type { AuditAction } from "../../types/AuditLog";

interface Props {
  action: AuditAction;
}

export default function AuditActionBadge({
  action,
}: Props) {

  const styles: Record<AuditAction, string> = {
    create: "bg-green-100 text-green-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-red-100 text-red-800",
    login: "bg-slate-100 text-slate-800",
    logout: "bg-slate-100 text-slate-800",
    export: "bg-purple-100 text-purple-800",
    status: "bg-yellow-100 text-yellow-800",
  };

  const labels: Record<AuditAction, string> = {
    create: "Create",
    update: "Update",
    delete: "Delete",
    login: "Login",
    logout: "Logout",
    export: "Export",
    status: "Status",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-sm
        font-semibold
        ${styles[action]}
      `}
    >
      {labels[action]}
    </span>
  );
}
