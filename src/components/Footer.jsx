import { Link } from "react-router-dom";

import classes from "./Footer.module.css";

function Footer() {
  return (
    <footer className={classes.footer}>
      Questions? <Link to="/support">Ask Away</Link>
    </footer>
  );
}

export default Footer;
