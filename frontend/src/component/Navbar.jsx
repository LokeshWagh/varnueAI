import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav
      className="relative backdrop-blur-md shadow-md z-50 text-black after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px"
      style={{
        background:
          "linear-gradient(45deg, #CDFFF1 0%, rgba(203, 245, 246, 0.73) 28.13%, rgba(240, 251, 224, 0.80) 79.75%, #F8FFDA 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-white/20 hover:text-gray-900 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Left Side */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start gap-3">
            <Link
              to="/"
              className="flex items-center space-x-2 text-black font-bold text-xl"
            >
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=cyan&shade=500"
                alt="Logo"
                className="h-8 w-auto"
              />
              <span className="hidden sm:inline">varnueAI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 text-sm font-medium hover:text-cyan-600 transition"
            >
              Home
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 text-sm font-medium hover:text-red-500 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 text-sm font-medium hover:text-cyan-600 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Profile Dropdown */}
          {user && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:ml-6 sm:pr-0">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative flex rounded-full focus:outline-none"
              >
                <img
                  className="w-9 h-9 rounded-full  ring-1 ring-white/20"
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                  alt="Profile"
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-44 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-white/10 transition transform scale-100 opacity-100 z-50">
                  <div className="px-4 py-2 text-gray-300 border-b border-gray-700">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  {user.role === "admin" && (
                    <Link
                      to="/alluser"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      All Users
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-600/70 hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white/60 backdrop-blur-md border-t border-gray-200 animate-fadeIn">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
            >
              Home
            </Link>

            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-red-500/20 hover:text-red-600"
                >
                  Logout
                </button>

                <div className="flex flex-col items-center mt-3 cursor-default select-none">
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full bg-gray-700 mb-2 ring-1 ring-gray-400/20"
                  />
                  <p className="text-sm text-gray-800 font-semibold">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center rounded-md bg-cyan-500 text-white px-3 py-2 text-base font-medium hover:bg-cyan-600 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
