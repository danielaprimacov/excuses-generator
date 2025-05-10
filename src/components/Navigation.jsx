import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

import logo from "../assets/images/logo.png";
import classes from "./Navigation.module.css";

function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const [mode, setMode] = useState(null); // 'login' | 'signup'

  const navigate = useNavigate();

  const open = (m) => setMode(m);
  const close = () => setMode(null);

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? `${classes.logoLink} ${classes.active}`
                  : classes.logoLink
              }
            >
              <img src={logo} alt="Logo" className={classes.logo} />
            </NavLink>
          </li>
          <div className={classes.navItems}>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? classes.active : "")}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reviews"
                className={({ isActive }) => (isActive ? classes.active : "")}
              >
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/upgrade"
                className={({ isActive }) => (isActive ? classes.active : "")}
              >
                Upgrade
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/support"
                className={({ isActive }) => (isActive ? classes.active : "")}
              >
                Support
              </NavLink>
            </li>
            <li>
              <div className={classes.search}>Search</div>
            </li>
            {user ? (
              <>
                <li>Hello, {user.username}</li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </li>
                {user.role === "admin" && (
                  <li>
                    <NavLink to="/admin">Admin Dashboard</NavLink>
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <button onClick={() => open("login")}>Login</button>
                </li>
                <li>
                  <button onClick={() => open("signup")}>Create Account</button>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>

      {mode === "login" && <LoginModal onClose={close} />}
      {mode === "signup" && (
        <SignupModal onClose={close} onSwitch={() => setMode("login")} />
      )}
    </header>
  );
}

export default Navigation;
