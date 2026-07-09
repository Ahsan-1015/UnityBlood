import {
  faBars,
  faCogs,
  faEdit,
  faFileAlt,
  faHome,
  faListAlt,
  faPlusCircle,
  faSignOutAlt,
  faUser,
  faUsers,
  faXmark,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import { AuthContext } from "../../providers/AuthProvider";
import { useTheme } from "../../providers/ThemeProvider";
import logo from "../../assets/images/logo.png";
import "../Dashboard/Dashboard.css";

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userInfo, logOut, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin] = useAdmin();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogOut = () => {
    logOut();
    navigate("/");
  };

  const isSelected = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, icon, label, onClick }) => (
    <li className="mb-1">
      <Link
        onClick={onClick}
        to={to}
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
          isSelected(to)
            ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        {isSelected(to) && (
          <span className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-red-500/80 blur-sm -z-10"></span>
        )}
        <span
          className={`text-sm w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            isSelected(to) ? "text-white" : "text-red-400"
          }`}
        >
          <FontAwesomeIcon icon={icon} />
        </span>
        <span className="font-medium text-sm tracking-wide">{label}</span>
        {isSelected(to) && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"></span>
        )}
      </Link>
    </li>
  );

  const links = (
    <ul className="space-y-0.5 px-2">
      <NavLink
        to="/dashboard"
        icon={faHome}
        label="Dashboard Overview"
        onClick={toggleSidebar}
      />
      <NavLink
        to="/dashboard/profile"
        icon={faUser}
        label="Profile"
        onClick={toggleSidebar}
      />
      {isAdmin && (
        <NavLink
          to="/dashboard/all-users"
          icon={faUsers}
          label="All Users"
          onClick={toggleSidebar}
        />
      )}
      {(isAdmin || userInfo?.role === "Volunteer") && (
        <>
          <NavLink
            to="/dashboard/all-donation-requests"
            icon={faListAlt}
            label="All Donations"
            onClick={toggleSidebar}
          />
          <NavLink
            to="/dashboard/content-management"
            icon={faEdit}
            label="Content Management"
            onClick={toggleSidebar}
          />
        </>
      )}
      <NavLink
        to="/dashboard/createDonation"
        icon={faPlusCircle}
        label="Create Donation"
        onClick={toggleSidebar}
      />
      {!(isAdmin || userInfo?.role === "Volunteer") && (
        <NavLink
          to="/dashboard/my-donation-requests"
          icon={faFileAlt}
          label="My Donations"
          onClick={toggleSidebar}
        />
      )}
      <NavLink
        to="/dashboard/settings"
        icon={faCogs}
        label="Settings"
        onClick={toggleSidebar}
      />
    </ul>
  );

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link
          onClick={mobile ? toggleSidebar : undefined}
          to="/dashboard"
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-red-500/40 group-hover:scale-105 transition-transform duration-300 bg-white">
            <img
              src={logo}
              alt="UnityBlood logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">
              Unity<span className="text-red-400">Blood</span>
            </h1>
            <p className="text-slate-400 text-xs">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        {links}
      </nav>

      {/* User Section */}
      <div className="px-4 py-4 border-t border-white/10">
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/50"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm">
                  {user.displayName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-800"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {user.displayName || "User"}
              </p>
              <p className="text-slate-400 text-xs truncate capitalize">
                {isAdmin ? "Admin" : userInfo?.role || "Donor"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogOut}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-xs" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="font-ysabeau-infant flex min-h-screen db-page db-text">
      {/* Fixed Sidebar for Desktop */}
      <aside className="w-64 fixed top-0 left-0 h-full hidden md:flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 shadow-2xl z-40">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-auto md:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-b db-border shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white transition-all duration-200"
            >
              <FontAwesomeIcon
                className="text-base"
                icon={isSidebarOpen ? faXmark : faBars}
              />
            </button>

            {/* Mobile Logo */}
            <Link to="/dashboard" className="md:hidden flex items-center gap-2">
              <span className="text-slate-800 dark:text-white font-bold text-lg">
                Unity<span className="text-red-500">Blood</span>
              </span>
            </Link>

            {/* Desktop Breadcrumb / Page title */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                {location.pathname === "/dashboard"
                  ? "Dashboard Overview"
                  : location.pathname
                      .split("/")
                      .filter(Boolean)
                      .map((p) => p.replace(/-/g, " "))
                      .join(" › ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
              </p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 border db-border"
              >
                <FontAwesomeIcon
                  icon={isDark ? faSun : faMoon}
                  className="text-base"
                />
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-all duration-200 border db-border"
              >
                <FontAwesomeIcon icon={faHome} className="text-xs" />
                <span className="hidden sm:inline">Go Home</span>
              </button>
              <button
                onClick={handleLogOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-xs" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          id="mobileSidebar"
          className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent mobile />
        </aside>

        {/* Main Content */}
        <main className="p-4 md:p-8 overflow-x-auto min-h-[calc(100vh-73px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
