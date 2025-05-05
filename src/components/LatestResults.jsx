import React, { useEffect, useRef, useState } from "react";
import classes from "./LatestResults.module.css";

function LatestResults() {
  const sliderRef = useRef(null);
  const [cards, setCards] = useState([]);

  const API_URL = "http://localhost:5000/categories";

  // 1) Fetch & flatten all excuses – now each item is an excuse
  const fetchAllExcuses = async () => {
    const res = await fetch(API_URL);
    const categories = await res.json();

    return categories.flatMap((cat) =>
      cat.situations.flatMap((sit) =>
        sit.excuses.map((exc) => ({
          id: exc.excuseId,
          excuseDescription: exc.excuseDescription,
          situationId: sit.situationId,
          situationName: sit.situationName,
          photoUrl: sit.photoUrl,
          categoryName: cat.categoryName,
        }))
      )
    );
  };

  // 2) On mount, pick newest excuses but keep one per situation
  useEffect(() => {
    let mounted = true;
    fetchAllExcuses().then((all) => {
      if (!mounted) return;
      // sort by newest excuseId first
      const sorted = all.sort((a, b) => b.id - a.id);
      // pick up to 7, skipping duplicates by situationId
      const picked = [];
      const seenSituations = new Set();
      for (const exc of sorted) {
        if (picked.length >= 7) break;
        if (!seenSituations.has(exc.situationId)) {
          picked.push(exc);
          seenSituations.add(exc.situationId);
        }
      }
      setCards(picked);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 3) Auto‐scroll logic (unchanged)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || cards.length === 0) return;

    const CARD_W = 300,
      GAP = 20,
      STEP = CARD_W + GAP;
    let idx = 0;

    const iv = setInterval(() => {
      if (idx * STEP >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
        idx = 0;
      } else {
        slider.scrollBy({ left: STEP, behavior: "smooth" });
        idx++;
      }
    }, 3000);

    return () => clearInterval(iv);
  }, [cards]);

  return (
    <div className={classes.results}>
      <p className={classes.heading}>People also generated</p>
      <div className={classes.slider} ref={sliderRef}>
        {cards.map((c) => (
          <div
            key={c.id}
            className={classes.card}
            style={{ backgroundImage: `url(${c.photoUrl})` }}
          >
            <div className={classes.overlay}>
              <h3 className={classes.title}>{c.excuseDescription}</h3>
              <p className={classes.subtitle}>{c.situationName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestResults;
