import React, { useEffect, useRef, useState } from "react";
import classes from "./LatestResults.module.css";

const API_URL = "http://localhost:5000";

function LatestResults() {
  const sliderRef = useRef(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchAndCombine() {
      try {
        // 1) Fetch all three resources in parallel
        const [catsRes, sitsRes, excsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/situations`),
          fetch(`${API_URL}/excuses?_sort=id&_order=desc`), // already sorted newest first
        ]);
        const [categories, situations, excuses] = await Promise.all([
          catsRes.json(),
          sitsRes.json(),
          excsRes.json(),
        ]);

        if (!mounted) return;

        // 2) Build lookup maps
        const categoryMap = new Map(
          categories.map((cat) => [cat.id, cat.categoryName])
        );
        const situationMap = new Map(
          situations.map((sit) => [
            sit.id,
            {
              name: sit.situationName,
              photoUrl: sit.photoUrl,
              categoryId: sit.categoryId,
            },
          ])
        );

        // 3) Enrich each excuse with its situation+category
        const all = excuses.map((exc) => {
          const sit = situationMap.get(exc.situationId) || {};
          return {
            id: exc.id,
            excuseDescription: exc.excuseDescription,
            situationId: exc.situationId,
            situationName: sit.name,
            photoUrl: sit.photoUrl,
            categoryName: categoryMap.get(sit.categoryId),
          };
        });

        // 4) Pick the first 7, skipping duplicates by situationId
        const picked = [];
        const seen = new Set();
        for (const exc of all) {
          if (picked.length >= 7) break;
          if (!seen.has(exc.situationId)) {
            picked.push(exc);
            seen.add(exc.situationId);
          }
        }

        setCards(picked);
      } catch (err) {
        console.error("Failed to load latest excuses:", err);
      }
    }

    fetchAndCombine();
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
