import { Link } from "react-router-dom";
import Headline from "./Headline";

import classes from "./WelcomeBanner.module.css";

function WelcomeBanner() {
  return (
    <>
      <div className={classes.banner}>
        <Headline />
        <div className={classes.actions}>
          <Link to="/about" className={classes["learn-btn"]}>
            Learn more
          </Link>
          <Link to="/upgrade" className={classes["upgrade-btn"]}>
            Upgrade
          </Link>
          <Link to="/excuses" className={classes["generate-btn"]}>
            Generate New Excuse
          </Link>
        </div>
      </div>
    </>
  );
}

export default WelcomeBanner;
