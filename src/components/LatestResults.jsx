import { useEffect, useRef, useState } from "react";

import {
  fetchCategories,
  fetchSituations,
  fetchLatestExcuses,
} from "../utils/api";
import classes from "./LatestResults.module.css";

function LatestResults() {
  const sliderRef = useRef(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // 1) Fetch lookups + latest excuses in parallel
        const [categories, situations, excuses] = await Promise.all([
          fetchCategories(),
          fetchSituations(),
          fetchLatestExcuses(),
        ]);

        if (!mounted) return;

        // 2) Build lookup maps
        const categoryMap = new Map(
          categories.map((c) => [c.id, c.categoryName])
        );
        const situationMap = new Map(
          situations.map((s) => [
            s.id,
            {
              name: s.situationName,
              photoUrl: s.photoUrl,
              categoryId: s.categoryId,
            },
          ])
        );

        // 3) Enrich excuses
        const enriched = excuses.map((e) => {
          const sit = situationMap.get(e.situationId) || {};
          return {
            id: e.id,
            excuseDescription: e.excuseDescription,
            situationId: e.situationId,
            situationName: sit.name,
            photoUrl: sit.photoUrl,
            categoryName: categoryMap.get(sit.categoryId),
          };
        });

        // 4) Pick first 7 unique-by-situation
        const picked = [];
        const seen = new Set();
        for (const ex of enriched) {
          if (picked.length >= 7) break;
          if (!seen.has(ex.situationId)) {
            picked.push(ex);
            seen.add(ex.situationId);
          }
        }

        setCards(picked);
      } catch (err) {
        console.error("Failed to load latest results:", err);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Auto‐scroll logic unchanged
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
