import { Link } from "react-router-dom";

import classes from "./WelcomeBanner.module.css";

function WelcomeBanner() {
  return (
    <>
      <div className={classes.banner}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          interdum molestie ante, at pharetra turpis lacinia sed. Aenean gravida
          volutpat diam in commodo. Nam ut congue diam, a vehicula justo. Etiam
          vulputate nisl eu elit rutrum maximus. Curabitur in lectus vel quam
          sodales aliquet non faucibus turpis. Suspendisse eget lorem et metus
          ornare dictum. !
        </p>
        <div className={classes.actions}>
          <Link to="/about" className={classes["learn-btn"]}>
            Learn more
          </Link>
          <Link to="/upgrade" className={classes["upgrade-btn"]}>
            Upgrade
          </Link>
        </div>
      </div>
    </>
  );
}

export default WelcomeBanner;
