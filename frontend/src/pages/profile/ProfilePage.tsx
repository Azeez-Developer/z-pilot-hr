import DashboardLayout from "../../layouts/DashboardLayout";
import { getJwtPayload } from "../../auth/jwt";
import "../../styles/profilePage.css";

export default function ProfilePage() {
  const user = getJwtPayload();

  if (!user) {
    return (
      <DashboardLayout title="Profile" roleLabel="">
        <div className="profile-error">User not authenticated.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile" roleLabel="Your account information">
      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span className="profile-value">
            {user.fullName ||
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              "—"}
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user.email ?? "—"}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Role</span>
          <span className="profile-value">{user.role}</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
