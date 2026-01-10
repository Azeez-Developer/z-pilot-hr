import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJwtPayload, getUserInitials } from "../auth/jwt";
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ User from JWT
  const user = getJwtPayload();
  const initials = getUserInitials();

  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "User";

  const role = user?.role?.toLowerCase() ?? "default";

  const goToDashboard = () => {
    if (role === "manager") navigate("/dashboard/manager");
    else if (role === "employee") navigate("/dashboard/employee");
    else if (role === "admin") navigate("/dashboard/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Close dropdown on click away + ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          {/* TITLE (informational only) */}
          <div className="dashboard-header-center">
            <h1 className="dashboard-title">{title}</h1>
            <p className="dashboard-subtitle">{roleLabel}</p>
          </div>

          {/* USER MENU */}
          <div className="dashboard-header-right" ref={menuRef}>
            <button
              className={`dashboard-avatar avatar-${role}`}
              onClick={() => setOpen((prev) => !prev)}
              aria-label="User menu"
            >
              {initials}
            </button>

            {open && (
              <div className="dashboard-menu-dropdown">
                {/* User info */}
                <div className="dashboard-menu-user">
                  <div className="dashboard-menu-name">{fullName}</div>
                  <div className="dashboard-menu-role">{user?.role}</div>
                </div>

                {/* ✅ My Dashboard (FIRST ITEM) */}
                <button
                  className="dashboard-menu-item"
                  onClick={() => {
                    setOpen(false);
                    goToDashboard();
                  }}
                >
                  My Dashboard
                </button>

                {/* Profile */}
                <button
                  className="dashboard-menu-item"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>

                {/* Settings */}
                <button
                  className="dashboard-menu-item"
                  onClick={() => {
                    setOpen(false);
                    navigate("/settings");
                  }}
                >
                  Settings
                </button>

                <div className="dashboard-menu-divider" />

                {/* Logout */}
                <button
                  className="dashboard-menu-item logout"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-container">{children}</main>
    </div>
  );
}
