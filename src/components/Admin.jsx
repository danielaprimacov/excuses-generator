import { NavLink } from "react-router-dom";

import add from "../assets/images/add.png";
import list from "../assets/images/list.png";
import chart from "../assets/images/chart-histogram.png";
import review from "../assets/images/review.png";
import support from "../assets/images/envelope.png";
import back from "../assets/images/arrow-alt-circle-left.png";
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
                <img className={classes.icon} src={list} alt="all-excuses" />{" "}
                <span className={classes.label}>All excuses</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="add-excuse"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <img className={classes.icon} src={add} alt="add-excuse" />{" "}
                <span className={classes.label}>Add Excuse</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="statistics"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <img className={classes.icon} src={chart} alt="chart-excuses" />
                <span className={classes.label}>Statistics</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="admin-reviews"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <img className={classes.icon} src={review} alt="reviews" />
                <span className={classes.label}>Reviews</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="support-tickets"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <img
                  className={classes.icon}
                  src={support}
                  alt="Support Tickets"
                />
                <span className={classes.label}>Support</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/">
                <img className={classes.icon} src={back} alt="Back Icon" />
                <span className={classes.label}>Go Back</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Admin;
