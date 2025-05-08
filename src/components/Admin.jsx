import { NavLink } from "react-router-dom";

import classes from "./Admin.module.css";

function Admin() {
  return (
    <>
      <div className={classes.sidebar}>
        <div className={classes.navigation}>
          <ul className={classes.list}>
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
              <NavLink to="/">Go Back</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Admin;
