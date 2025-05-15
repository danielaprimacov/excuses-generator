import { useEffect, useState } from "react";

import classes from "./Headline.module.css";

const words = ["family", "work", "friends", "partner"];

function Headline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.headline}>
      <span>Make excuses for </span>
      <span className={classes.wordWrapper}>
        {words.map((word, i) => (
          <span
            key={i}
            className={`${classes.word} ${
              i === index ? classes.visible : classes.hidden
            }`}
          >
            {word}
          </span>
        ))}
      </span>
      <p>Exit Strategies for Everyday Life</p>
    </div>
  );
}

export default Headline;
