import DashboardLayout from "../../layouts/DashboardLayout";
import "../../styles/settingsPage.css";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" roleLabel="Application preferences">
      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-label">Theme</span>
          <span className="settings-value">Light (default)</span>
        </div>

        <div className="settings-row">
          <span className="settings-label">Time Format</span>
          <span className="settings-value">12-hour</span>
        </div>

        <div className="settings-row">
          <span className="settings-label">Notifications</span>
          <span className="settings-value">Enabled</span>
        </div>

        <div className="settings-note">
          More settings will be available in future updates.
        </div>
      </div>
    </DashboardLayout>
  );
}
