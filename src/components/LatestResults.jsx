import React, { useEffect, useRef } from "react";
import classes from "./LatestResults.module.css";

function LatestResults() {
  const sliderRef = useRef(null);

  const cards = [
    { id: 1, background: "https://via.placeholder.com/300x200?text=Card+1" },
    { id: 2, background: "https://via.placeholder.com/300x200?text=Card+2" },
    { id: 3, background: "https://via.placeholder.com/300x200?text=Card+3" },
    { id: 4, background: "https://via.placeholder.com/300x200?text=Card+4" },
    { id: 5, background: "https://via.placeholder.com/300x200?text=Card+5" },
    { id: 6, background: "https://via.placeholder.com/300x200?text=Card+6" },
    { id: 7, background: "https://via.placeholder.com/300x200?text=Card+7" },
  ];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cardWidth = 300;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    let currentIndex = 0;

    const interval = setInterval(() => {
      // If the next scroll exceeds the visible width, reset back to start
      if (
        currentIndex * scrollAmount >=
        slider.scrollWidth - slider.clientWidth
      ) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
        currentIndex = 0;
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
        currentIndex++;
      }
    }, 3000); // change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.results}>
      <p className={classes.heading}>Latest Results</p>
      <div className={classes.slider} ref={sliderRef}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={classes.card}
            style={{ backgroundImage: `url(${card.background})` }}
          />
        ))}
      </div>
    </div>
  );
}

export default LatestResults;
