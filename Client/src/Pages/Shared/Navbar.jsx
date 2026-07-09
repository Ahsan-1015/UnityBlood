import {
  faBars,
  faMoon,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../providers/AuthProvider";
import { useTheme } from "../../providers/ThemeProvider";

export default function Navbar() {
  const { user, logOut, loading } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDashboard = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logOut();
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      {loading ? (
        <div className="w-full h-24 flex items-center justify-center">
          <span className="loading loading-bars loading-md"></span>
        </div>
      ) : (
        <div>
          <nav className="border-b border-red-100/70 bg-white/95 text-slate-900 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100">
            <div className="container mx-auto px-4 flex justify-between items-center py-4">
              {/* Logo */}
              <Link to={"/"} className="flex items-center gap-2">
                <img className="h-10" src={logo} alt="UnityBlood" />
                <span className="font-black text-2xl xl:text-3xl text-teal-700 dark:text-teal-400">
                  Unity
                  <span className="text-red-600 dark:text-red-400">Blood</span>
                </span>
              </Link>

              {/* Desktop Links */}
              <div className="hidden md:flex space-x-6 text-lg ">
                <NavLink
                  to="/pending-donation-requests"
                  className={({ isActive }) =>
                    `transition hover:text-red-600 dark:hover:text-red-400 ${
                      isActive
                        ? "text-red-600 font-bold border-b-2 border-red-600 dark:text-red-400 dark:border-red-400"
                        : "text-slate-600 font-semibold dark:text-slate-300"
                    }`
                  }
                >
                  Donation Requests
                </NavLink>
                <NavLink
                  to="/blogs"
                  className={({ isActive }) =>
                    `transition hover:text-red-600 dark:hover:text-red-400 ${
                      isActive
                        ? "text-red-600 font-bold border-b-2 border-red-600 dark:text-red-400 dark:border-red-400"
                        : "text-slate-600 font-semibold dark:text-slate-300"
                    }`
                  }
                >
                  Blog
                </NavLink>
                <NavLink
                  to="/payment"
                  className={({ isActive }) =>
                    `transition hover:text-red-600 dark:hover:text-red-400 ${
                      isActive
                        ? "text-red-600 font-bold border-b-2 border-red-600 dark:text-red-400 dark:border-red-400"
                        : "text-slate-600 font-semibold dark:text-slate-300"
                    }`
                  }
                >
                  Funding
                </NavLink>
              </div>

              {/* User Avatar with Dropdown */}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white text-slate-700 shadow-sm transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-red-400"
                >
                  <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
                </button>

                <div className="relative">
                  {user && (
                    <button
                      className="flex items-center space-x-2 rounded-md border border-red-100 bg-red-50 p-1 pr-3 dark:border-slate-700 dark:bg-slate-800/80"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <img
                        src={user?.photoURL}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-md border-2 border-white object-cover"
                      />
                      <span className="hidden md:block text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {user?.displayName || ""}
                      </span>
                    </button>
                  )}

                  {isDropdownOpen && user && (
                    <div className="p-2 absolute flex flex-col right-0 mt-2 w-48 bg-white text-slate-900 text-left rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                      <Link
                        onClick={handleDashboard}
                        to="/dashboard"
                        className="px-4 py-2 rounded-md hover:bg-red-50 hover:text-red-700 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-left px-4 py-2 rounded-md hover:bg-red-50 hover:text-red-700 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Hamburger Menu */}

                {!user && (
                  <Link to="login">
                    <button className="rounded-md bg-teal-700 px-5 py-2.5 text-lg font-bold text-white transition hover:bg-teal-800">
                      Login
                    </button>
                  </Link>
                )}

                <button
                  className="md:hidden rounded-md border border-red-200 text-red-600 dark:border-slate-700 dark:text-red-400"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? (
                    <FontAwesomeIcon
                      className="text-lg w-8 px-1 py-2"
                      icon={faXmark}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="text-lg w-8 px-1 py-2"
                      icon={faBars}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Links */}
            {isOpen && (
              <div className="md:hidden border-t border-red-100 bg-white dark:border-slate-700 dark:bg-slate-900">
                <Link
                  to="/pending-donation-requests"
                  className="block px-4 py-3 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                >
                  Donation Requests
                </Link>
                <Link
                  to="/blogs"
                  className="block px-4 py-3 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                >
                  Blog
                </Link>
                <Link
                  to="/payment"
                  className="block px-4 py-3 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                >
                  Funding
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
