import React, { useState, useEffect } from "react";
import classes from "./Categories.module.css";

const API_URL = "http://localhost:5000";
const DISPLAY_COUNT = 3;

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 1) Fetch categories and situations in parallel
        const [catsRes, sitsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/situations`),
        ]);
        if (!catsRes.ok)
          throw new Error(`Categories fetch failed (${catsRes.status})`);
        if (!sitsRes.ok)
          throw new Error(`Situations fetch failed (${sitsRes.status})`);
        const [categories, situations] = await Promise.all([
          catsRes.json(),
          sitsRes.json(),
        ]);

        // 2) Build a map: categoryId → categoryName
        const catMap = new Map(
          categories.map((cat) => [cat.id, cat.categoryName])
        );

        // 3) Group situations by categoryName
        const grouped = situations.reduce((acc, sit) => {
          const name = catMap.get(sit.categoryId) || "Uncategorized";
          acc[name] = acc[name] || [];
          acc[name].push({
            situationName: sit.situationName,
            photoUrl: sit.photoUrl,
          });
          return acc;
        }, {});

        // 4) Order your categories as desired
        const ORDER = ["Family", "Work", "Financial", "Relationship"];
        const ordered = ORDER.reduce((arr, catName) => {
          if (grouped[catName]) {
            arr.push({ categoryName: catName, situations: grouped[catName] });
          }
          return arr;
        }, []);

        setCats(ordered);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    }

    loadData();
  }, []);

  if (error) return <p className={classes.error}>Error: {error}</p>;
  if (!cats.length) return <p>Loading…</p>;

  return (
    <div className={classes.categories}>
      {cats.map(({ categoryName, situations }) => {
        // ensure at least 3 cards per row
        const display =
          situations.length >= DISPLAY_COUNT
            ? situations.slice(0, DISPLAY_COUNT)
            : [
                ...situations,
                ...Array.from(
                  { length: DISPLAY_COUNT - situations.length },
                  () => ({ placeholder: true })
                ),
              ];

        return (
          <div key={categoryName} className={classes.category}>
            <p>Category: {categoryName}</p>
            <div className={classes.cardRow}>
              {display.map((item, idx) =>
                item.placeholder ? (
                  <div key={`ph-${idx}`} className={classes.card} />
                ) : (
                  <div
                    key={item.situationName}
                    className={classes.card}
                    style={
                      item.photoUrl
                        ? { backgroundImage: `url(${item.photoUrl})` }
                        : {}
                    }
                    aria-label={item.situationName}
                  >
                    <p className={classes.cardTitle}>{item.situationName}</p>
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
