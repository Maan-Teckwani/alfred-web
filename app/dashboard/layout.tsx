import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import "./dashboard.css";

/**
 * Dashboard shell. `hidePersonal` on the switcher is deliberate: the API derives
 * the tenant from the session's organization claim, so a personal (org-less)
 * account has no tenant and would be rejected.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash">
      <header className="dash-top">
        <Link href="/dashboard" className="dash-brand">
          Alfred
        </Link>
        <nav className="dash-nav">
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/runs">Runs</Link>
          <Link href="/dashboard/repositories">Repositories</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </nav>
        <div className="dash-account">
          <OrganizationSwitcher hidePersonal afterSelectOrganizationUrl="/dashboard" />
          <UserButton />
        </div>
      </header>
      <main className="dash-main">{children}</main>
    </div>
  );
}
