import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  LayoutDashboard,
  Award,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "";

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest(".navbar-mobile-toggle")
      ) {
        setMobileOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 860) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const closeAll = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    closeAll();
    await logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo" onClick={closeAll}>
              <span>E</span>
              <GraduationCap />
          </Link>

          <nav className="navbar-links">
            <NavLink end to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/courses" className={navLinkClass}>
              Courses
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          <div className="navbar-actions">
            {!user && (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
              </>
            )}

            {user && (
              <div className="navbar-user" ref={dropdownRef}>
                <button
                  className="navbar-user-trigger"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  onClick={() => setDropdownOpen((o) => !o)}
                >
                  <span className="navbar-avatar">{initials}</span>

                  <div className="navbar-user-info">
                    <span>{user.name}</span>
                  </div>

                  <ChevronDown
                    size={16}
                    className={dropdownOpen ? "rotate" : ""}
                  />
                </button>

                <div
                  className={`navbar-dropdown ${dropdownOpen ? "open" : ""}`}
                >
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={closeAll}>
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link to="/my-courses" onClick={closeAll}>
                    <BookOpen size={16} />
                    My Courses
                  </Link>

                  <Link to="/certificates" onClick={closeAll}>
                    <Award size={16} />
                    Certificates
                  </Link>

                  <Link to="/profile" onClick={closeAll}>
                    <User size={16} />
                    Profile
                  </Link>

                  <button onClick={handleLogout}>
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            )}

            <button
              className="navbar-mobile-toggle"
              aria-label="Toggle Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`navbar-overlay ${mobileOpen ? "show" : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          ref={mobileMenuRef}
          className={`navbar-mobile-menu ${mobileOpen ? "open" : ""}`}
        >
          <div className="container">
            <NavLink end to="/" onClick={closeAll}>
              Home
            </NavLink>

            <NavLink to="/courses" onClick={closeAll}>
              Courses
            </NavLink>

            <NavLink to="/about" onClick={closeAll}>
              About
            </NavLink>

            <NavLink to="/contact" onClick={closeAll}>
              Contact
            </NavLink>

            {!user ? (
              <>
                <Link to="/login" onClick={closeAll}>
                  Log in
                </Link>
              </>
            ) : (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={closeAll}>
                    Admin Dashboard
                  </Link>
                )}

                <Link to="/my-courses" onClick={closeAll}>
                  My Courses
                </Link>

                <Link to="/certificates" onClick={closeAll}>
                  Certificates
                </Link>

                <Link to="/profile" onClick={closeAll}>
                  Profile
                </Link>

                <button onClick={handleLogout}>Log Out</button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
