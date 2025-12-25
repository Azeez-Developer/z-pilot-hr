import { useEffect, useState } from "react";
import { getMyTimeHistory } from "../../api/employeeTimeApi";
import type { MyHistoryResponse } from "../../api/employeeTimeApi";
import "../../styles/auth.css";

/* ======================
   Helpers
====================== */

function formatTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value: string) {
  return new Date(value).toDateString();
}

function formatHours(hours?: number | null) {
  if (hours === null || hours === undefined) return "—";
  return hours.toFixed(2);
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

/* ======================
   Component
====================== */

export default function EmployeeTimeHistory() {
  const [data, setData] = useState<MyHistoryResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyTimeHistory()
      .then(setData)
      .catch(() => setError("Failed to load time history."));
  }, []);

  if (error) {
    return <div className="auth-error">{error}</div>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const todayEntry = data.recent.find(entry =>
    isSameDay(entry.date, data.today)
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-brand">
          <h1 className="auth-title">My Time</h1>
          <p className="auth-subtitle">Hours & recent activity</p>
        </div>

        {/* TODAY */}
        <div className="auth-form">
          <h3 style={{ marginBottom: "8px" }}>Today</h3>

          <div className="auth-field">
            <div
              className="auth-input"
              style={{
                background: "#eef2ff",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {formatDate(data.today)}
            </div>
          </div>

          <p>
            <strong>In:</strong>{" "}
            {todayEntry?.clockIn ? formatTime(todayEntry.clockIn) : "—"}
          </p>

          <p>
            <strong>Out:</strong>{" "}
            {todayEntry?.clockOut
              ? formatTime(todayEntry.clockOut)
              : "Active"}
          </p>
        </div>

        {/* THIS WEEK */}
        <div className="auth-form">
          <h3 style={{ marginBottom: "8px" }}>This Week</h3>

          <div
            className="auth-input"
            style={{
              background: "#eef2ff",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {formatHours(data.weeklyHours)} hours
          </div>
        </div>

        {/* RECENT */}
        <div className="auth-form">
          <h3 style={{ marginBottom: "12px" }}>Recent Activity</h3>

          {data.recent.length === 0 && (
            <p>No recent clock activity.</p>
          )}

          {data.recent.map((entry, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <strong>{formatDate(entry.date)}</strong>
              <p>In: {formatTime(entry.clockIn)}</p>
              <p>
                Out:{" "}
                {entry.clockOut
                  ? formatTime(entry.clockOut)
                  : "Active"}
              </p>
              <p>Hours: {formatHours(entry.hours)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
