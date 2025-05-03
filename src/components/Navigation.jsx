import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/images/logo.png";
import classes from "./Navigation.module.css";

function Navigation() {
  const [showModal, setShowModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [entryError, setEntryError] = useState("");

  const navigate = useNavigate();

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setAdminPassword("");
    setEntryError("");
  };

  const submitAdminEntry = (e) => {
    e.preventDefault();
    const CORRECT = import.meta.env.VITE_ADMIN_PASSWORD || "letmein";
    if (adminPassword === CORRECT) {
      closeModal();
      navigate("/admin");
    } else {
      setEntryError("Incorrect password");
    }
  };

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
          {/* Other nav links grouped on the right */}
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
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? classes.active : "")}
                onClick={(e) => {
                  e.preventDefault(); // prevent immediate navigation
                  openModal();
                }}
              >
                Admin
              </NavLink>
            </li>

            {showModal && (
              <div className={classes.modalOverlay}>
                <div className={classes.modal}>
                  <form onSubmit={submitAdminEntry}>
                    <label className={classes.label}>
                      You need to enter the admin password:
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className={classes.input}
                        required
                      />
                    </label>
                    {entryError && (
                      <p className={classes.error}>{entryError}</p>
                    )}
                    <div className={classes.modalButtons}>
                      <button type="submit" className={classes["submit-btn"]}>
                        Enter
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className={classes["cancel-btn"]}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
