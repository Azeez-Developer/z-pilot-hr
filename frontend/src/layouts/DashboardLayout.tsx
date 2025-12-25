import type { ReactNode } from "react";
import "../styles/auth.css";

interface DashboardLayoutProps {
  title: string;
  roleLabel: string;
  children: ReactNode;
}

export default function DashboardLayout({
  title,
  roleLabel,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1 className="auth-title">Z Pilot HR</h1>
          <p className="auth-subtitle">
            {title} · {roleLabel}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
