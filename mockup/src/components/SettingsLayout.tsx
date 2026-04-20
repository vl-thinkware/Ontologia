import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  Building2,
  Users,
  KeyRound,
  CreditCard,
  Webhook,
  ShieldCheck,
  BellRing,
  Plug,
} from "lucide-react";

const nav = [
  { to: "/settings", label: "Workspace", icon: Building2, end: true },
  { to: "/settings/members", label: "Members", icon: Users },
  { to: "/settings/api-keys", label: "API keys", icon: KeyRound },
  { to: "/settings/billing", label: "Billing & usage", icon: CreditCard },
  { to: "#", label: "Webhooks", icon: Webhook, soon: true },
  { to: "#", label: "Integrations", icon: Plug, soon: true },
  { to: "#", label: "Security", icon: ShieldCheck, soon: true },
  { to: "#", label: "Notifications", icon: BellRing, soon: true },
];

export default function SettingsLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-8 py-8">
      <nav className="w-56 shrink-0">
        <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          Workspace settings
        </div>
        <ul className="space-y-0.5">
          {nav.map((n) => (
            <li key={n.label}>
              {n.soon ? (
                <span className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink-400">
                  <n.icon className="h-4 w-4" />
                  {n.label}
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    soon
                  </span>
                </span>
              ) : (
                <NavLink
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-700 hover:bg-ink-100"
                    )
                  }
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-ink-900">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-ink-600">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        <div className="mt-6 space-y-6">{children}</div>
      </div>
    </div>
  );
}
