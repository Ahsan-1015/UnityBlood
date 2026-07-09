import { useState } from "react";
import { useTheme } from "../../providers/ThemeProvider";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faBell, faLock, faUserShield, faSave } from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  
  // Notification States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchingAlerts, setMatchingAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Settings Saved!",
      text: "Your preferences have been updated successfully.",
      background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both current and new passwords.",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
      return;
    }
    
    // Simulate updating password
    Swal.fire({
      icon: "success",
      title: "Password Updated!",
      text: "Your password has been changed.",
      background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      showConfirmButton: false,
      timer: 1500,
    });
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header section */}
      <div className="page-header">
        <h1>Dashboard Settings</h1>
        <p>Manage your themes, notification settings, security options, and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card: Theme & Visuals */}
        <div className="db-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold db-text flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={isDark ? faMoon : faSun} className="text-red-500" />
              Appearance & Theme
            </h2>
            <p className="text-sm db-text-muted mb-6">
              Customize the look and feel of the UnityBlood client dashboard to match your environmental preference.
            </p>

            <div className="space-y-4">
              <div 
                onClick={!isDark ? toggleTheme : undefined}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  isDark 
                    ? "border-red-500 bg-red-500/5" 
                    : "border-transparent bg-slate-100/50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                    <FontAwesomeIcon icon={faMoon} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm db-text">Dark Mode</h3>
                    <p className="text-xs db-text-muted mt-0.5">High contrast, soft dark colors</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isDark ? "border-red-500" : "border-slate-300"
                }`}>
                  {isDark && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                </div>
              </div>

              <div 
                onClick={isDark ? toggleTheme : undefined}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  !isDark 
                    ? "border-red-500 bg-red-500/5" 
                    : "border-transparent bg-slate-800/40 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <FontAwesomeIcon icon={faSun} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm db-text">Light Mode</h3>
                    <p className="text-xs db-text-muted mt-0.5">Bright layout, classic look</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  !isDark ? "border-red-500" : "border-slate-600"
                }`}>
                  {!isDark && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t db-border flex justify-end">
            <span className="text-xs db-text-muted italic">Theme is automatically saved</span>
          </div>
        </div>

        {/* Card: Notifications */}
        <div className="db-card p-6 flex flex-col justify-between">
          <form onSubmit={handleSaveSettings} className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold db-text flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faBell} className="text-red-500" />
                Notification Preferences
              </h2>
              <p className="text-sm db-text-muted mb-6">
                Decide how and when you want to receive alerts, emergency donation updates, and platform announcements.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm db-text">Email Alerts</h3>
                    <p className="text-xs db-text-muted">Receive notifications on account changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="checkbox checkbox-error checkbox-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm db-text">Emergency Matches</h3>
                    <p className="text-xs db-text-muted">Get alerted when a nearby patient needs your blood type</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={matchingAlerts}
                    onChange={(e) => setMatchingAlerts(e.target.checked)}
                    className="checkbox checkbox-error checkbox-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm db-text">Weekly Newsletter</h3>
                    <p className="text-xs db-text-muted">Read updates on blood campaigns and stories</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="checkbox checkbox-error checkbox-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t db-border flex justify-end">
              <button type="submit" className="btn-red flex items-center gap-2 py-2 text-xs">
                <FontAwesomeIcon icon={faSave} />
                Save Notifications
              </button>
            </div>
          </form>
        </div>

        {/* Card: Password Security Settings */}
        <div className="db-card p-6 md:col-span-2">
          <form onSubmit={handleSecurityUpdate}>
            <h2 className="text-lg font-bold db-text flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faLock} className="text-red-500" />
              Account Security & Password
            </h2>
            <p className="text-sm db-text-muted mb-6">
              Keep your credentials secure. Change your password regularly to prevent unauthorized dashboard access.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="db-label">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="db-input"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="db-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="db-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t db-border flex justify-between items-center">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold">
                <FontAwesomeIcon icon={faUserShield} />
                Security protocols are active
              </div>
              <button type="submit" className="btn-red flex items-center gap-2 py-2 text-xs">
                <FontAwesomeIcon icon={faSave} />
                Change Password
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
