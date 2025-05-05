import { Link } from "react-router-dom";
import Headline from "./Headline";

import classes from "./WelcomeBanner.module.css";

function WelcomeBanner() {
  return (
    <>
      <div className={classes.banner}>
        <Headline />
          <Link to="/excuses" className={classes["generate-btn"]}>
           Get Started
          </Link>
      </div>
    </>
  );
}

export default WelcomeBanner;
