import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getManagerTimeOverview } from "../../api/managerTimeApi";
import type { ManagerTimeOverviewResponse } from "../../api/managerTimeApi";
import "../../styles/ManagerDashboard.css";

export default function ManagerDashboard() {
  const [data, setData] = useState<ManagerTimeOverviewResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getManagerTimeOverview()
      .then(setData)
      .catch(() => setError("Failed to load manager dashboard."));
  }, []);

  if (error) {
    return (
      <DashboardLayout title="Manager Dashboard" roleLabel="Manager">
        <div className="manager-dashboard">
          <div className="manager-error">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout title="Manager Dashboard" roleLabel="Manager">
        <div className="manager-dashboard">Loading...</div>
      </DashboardLayout>
    );
  }

  const totalEmployees = data.employees.length;
  const clockedIn = data.employees.filter(
    (e) => e.status === "Clocked In"
  ).length;
  const clockedOut = data.employees.filter(
    (e) => e.status === "Clocked Out"
  ).length;

  return (
    <DashboardLayout
      title="Manager Dashboard"
      roleLabel="Live overview of your team"
    >
      <div className="manager-dashboard">

        {/* STATS */}
        <div className="manager-stats">
          <StatCard label="Employees" value={totalEmployees} color="blue" />
          <StatCard label="Clocked In" value={clockedIn} color="green" />
          <StatCard label="Clocked Out" value={clockedOut} color="red" />
          <StatCard label="Issue Alert" value={0} color="yellow" />
        </div>

        {/* SEARCH */}
        <div className="manager-search">
          <div className="manager-search-inner">
            <input
              className="manager-search-input"
              placeholder="Search employees..."
            />
          </div>
        </div>

        {/* EMPLOYEES */}
        <div className="manager-employee-grid">
          {data.employees.map((emp) => (
            <div className="manager-employee-card" key={emp.userId}>
              <div className="manager-employee-avatar">
                {emp.fullName.charAt(0)}
              </div>

              <div>
                <div className="manager-employee-top">
                  <h3 className="manager-employee-name">{emp.fullName}</h3>

                  <span
                    className={`manager-status-pill ${
                      emp.status === "Clocked In" ? "in" : "out"
                    }`}
                  >
                    <span className="manager-status-dot" />
                    {emp.status}
                  </span>
                </div>

                <div className="manager-employee-lines">
                  <div>
                    Today:{" "}
                    <strong>{emp.todayHours.toFixed(2)}</strong> hours
                  </div>
                  <div>
                    This Week:{" "}
                    <strong>{emp.weeklyHours.toFixed(2)}</strong> hours
                  </div>
                </div>

                <div className="manager-employee-divider" />

                <div className="manager-employee-meta">
                  <div>
                    Last In:{" "}
                    {emp.lastClockIn
                      ? new Date(emp.lastClockIn).toLocaleString()
                      : "—"}
                  </div>
                  <div>
                    Last Out:{" "}
                    {emp.lastClockOut
                      ? new Date(emp.lastClockOut).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

/* Reusable stat card (NO ICONS) */
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "green" | "red" | "yellow";
}) {
  return (
    <div className="manager-stat-card">
      <div className="manager-stat-label-top">{label}</div>

      <div className="manager-stat-divider" />

      <div className={`manager-stat-number ${color}`}>{value}</div>

      <div className="manager-stat-label-bottom">{label}</div>
    </div>
  );
}

