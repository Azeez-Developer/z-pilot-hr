import type { ReactNode } from "react";
import "../styles/dashboardLayout.css";

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
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1 className="dashboard-title">{title}</h1>
        <p className="dashboard-subtitle">{roleLabel}</p>
      </header>

      <main className="dashboard-container">
        {children}
      </main>
    </div>
  );
}
