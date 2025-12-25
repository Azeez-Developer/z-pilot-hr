import { useEffect, useState } from "react";
import { getManagerTimeOverview } from "../../api/managerTimeApi";
import type {
  ManagerTimeOverviewResponse,
  ManagerEmployeeOverview,
} from "../../api/managerTimeApi";
import "../../styles/auth.css";

/* ======================
   Helpers
====================== */

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatHours(hours?: number | null) {
  if (hours === null || hours === undefined) return "—";
  return hours.toFixed(2);
}

/* ======================
   Component
====================== */

export default function ManagerDashboard() {
  const [data, setData] = useState<ManagerTimeOverviewResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getManagerTimeOverview()
      .then(setData)
      .catch(() => setError("Failed to load team time overview."));
  }, []);

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-error">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-brand">
          <h1 className="auth-title">Team Time Overview</h1>
          <p className="auth-subtitle">Who’s working right now</p>
        </div>

        {/* Employees */}
        <div className="auth-form">
          {data.employees.length === 0 && (
            <p>No employees found.</p>
          )}

          {data.employees.map((employee: ManagerEmployeeOverview) => (
            <div
              key={employee.userId}
              style={{
                padding: "14px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                marginBottom: "12px",
              }}
            >
              <strong>{employee.fullName}</strong>

              <p>
                <strong>Status:</strong> {employee.status}
              </p>

              <p>
                <strong>Today:</strong>{" "}
                {formatHours(employee.todayHours)} hours
              </p>

              <p>
                <strong>This Week:</strong>{" "}
                {formatHours(employee.weeklyHours)} hours
              </p>

              <p>
                <strong>Last In:</strong>{" "}
                {formatDateTime(employee.lastClockIn)}
              </p>

              <p>
                <strong>Last Out:</strong>{" "}
                {formatDateTime(employee.lastClockOut)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
