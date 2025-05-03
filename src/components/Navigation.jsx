import { NavLink } from "react-router-dom";

import logo from "../assets/images/logo.png";
import classes from "./Navigation.module.css";

function Navigation() {
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
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                About
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
              <NavLink
                to="/upgrade"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Upgrade
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Support
              </NavLink>
            </li>
            <li>
              <div className={classes.search}>Search</div>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
