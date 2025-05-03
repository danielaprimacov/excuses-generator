import React, { useState, useEffect } from "react";
import classes from "./Categories.module.css";

const API_URL = "http://localhost:5000/categories";

const fetchAllExcuses = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  const data = await res.json();

  // Handle two shapes: { categories: [...] } or direct [...categories]
  const catsArr = Array.isArray(data.categories)
    ? data.categories
    : Array.isArray(data)
    ? data
    : [];

  return catsArr.flatMap((cat) => {
    const situations = Array.isArray(cat.situations) ? cat.situations : [];
    return situations.flatMap((sit) => {
      const image = sit.photoUrl || null;
      return (Array.isArray(sit.excuses) ? sit.excuses : []).map((exc) => ({
        ...exc,
        situationName: sit.situationName,
        categoryName: cat.categoryName,
        photoUrl: image,
      }));
    });
  });
};

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchAllExcuses();

        // group & dedupe
        const grouped = all.reduce(
          (acc, { categoryName, situationName, photoUrl }) => {
            acc[categoryName] ??= {};
            if (!acc[categoryName][situationName]) {
              acc[categoryName][situationName] = { situationName, photoUrl };
            }
            return acc;
          },
          {}
        );

        // only these four, in order:
        const ORDER = ["Family", "Work", "Financial", "Relationship"];
        const filtered = ORDER.map((name) =>
          grouped[name]
            ? { categoryName: name, situations: Object.values(grouped[name]) }
            : null
        ).filter(Boolean);

        setCats(filtered);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    })();
  }, []);

  if (error) return <p className={classes.error}>Error: {error}</p>;
  if (!cats.length) return <p>Loading…</p>;

  return (
    <div className={classes.categories}>
      {cats.map(({ categoryName, situations }) => {
        // ensure at least 3 cards
        const display =
          situations.length >= 3
            ? situations
            : [
                ...situations,
                ...Array(3 - situations.length).fill({ placeholder: true }),
              ];

        return (
          <div key={categoryName} className={classes.category}>
            <p>Category: {categoryName}</p>
            <div className={classes.cardRow}>
              {display.map((item, idx) => {
                if (item.placeholder) {
                  // blank placeholder
                  return (
                    <div key={`placeholder-${idx}`} className={classes.card} />
                  );
                }
                const { situationName, photoUrl } = item;
                return (
                  <div
                    key={situationName}
                    className={classes.card}
                    style={
                      photoUrl ? { backgroundImage: `url(${photoUrl})` } : {}
                    }
                    aria-label={situationName}
                  >
                    <p className={classes.cardTitle}>{situationName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
