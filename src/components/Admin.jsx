import { NavLink } from "react-router-dom";

import logo from "../assets/images/logo.png";
import classes from "./Admin.module.css";

function Admin() {
  return (
    <>
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
          </ul>
        </nav>
      </header>
      <div className={classes.sidebar}>
        <div className={classes.navigation}>
          <ul className={classes["sidebar-list"]}>
            <li>
              <NavLink
                to="all-excuses"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                All excuses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="add-excuse"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Add Excuse
              </NavLink>
            </li>
            <li>
              <NavLink
                to=""
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Statistics
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reviews"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink to="/">Go Back</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Admin;
