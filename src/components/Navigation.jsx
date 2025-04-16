import { NavLink } from "react-router-dom";

import classes from "./Navigation.module.css";

function Navigation() {
  return (
    <>
      <header className={classes.header}>
        <nav>
          <ul className={classes.list}>
            <li>
              <NavLink
                to=""
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                end
              >
                Home
              </NavLink>
            </li>
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
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Admin
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Navigation;
