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

  // ✅ Pull user info from JWT
  const user = getJwtPayload();
  const initials = getUserInitials();

  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "User";

  const role = user?.role ?? "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Close dropdown on outside click OR ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          {/* CENTER TITLE */}
          <div className="dashboard-header-center">
            <h1 className="dashboard-title">{title}</h1>
            <p className="dashboard-subtitle">{roleLabel}</p>
          </div>

          {/* USER MENU */}
          <div className="dashboard-header-right" ref={menuRef}>
            <button
              className="dashboard-avatar"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="User menu"
            >
              {initials}
            </button>

            {open && (
              <div className="dashboard-menu-dropdown">
                <div className="dashboard-menu-user">
                  <div className="dashboard-menu-name">{fullName}</div>
                  <div className="dashboard-menu-role">{role}</div>
                </div>

                <button className="dashboard-menu-item" disabled>
                  Profile
                </button>
                <button className="dashboard-menu-item" disabled>
                  Settings
                </button>

                <div className="dashboard-menu-divider" />

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
