import { useState, useEffect } from "react";

import { fetchCategories, fetchSituations } from "../utils/api";
import classes from "./Categories.module.css";

const DISPLAY_COUNT = 3;
const ORDER = ["Family", "Work", "Financial", "Relationship"];

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [categories, situations] = await Promise.all([
          fetchCategories(),
          fetchSituations(),
        ]);

        // Map categoryId → categoryName
        const catMap = new Map(categories.map((c) => [c.id, c.categoryName]));

        // Group situations by categoryName
        const grouped = situations.reduce((acc, sit) => {
          const name = catMap.get(sit.categoryId) || "Uncategorized";
          acc[name] = acc[name] || [];
          acc[name].push({
            situationName: sit.situationName,
            photoUrl: sit.photoUrl,
          });
          return acc;
        }, {});

        // Order and shape for rendering
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
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p className={classes.loading}>Loading…</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

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
