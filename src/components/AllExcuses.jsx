import { useState, useEffect } from "react";

import classes from "./AllExcuses.module.css";

const API_URL = "http://localhost:5000/categories";

function AllExcuses() {
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Fetched data:", data);

        // handle either shape: data = { categories: [...] } or data = [...]
        const categories = Array.isArray(data)
          ? data
          : Array.isArray(data.categories)
          ? data.categories
          : [];

        // flatten all excuses across categories
        const all = categories.flatMap(
          (cat) =>
            cat.situations?.flatMap((sit) =>
              sit.excuses.map((exc) => ({
                ...exc,
                categoryName: cat.categoryName,
                situationName: sit.situationName,
              }))
            ) ?? []
        );

        setExcuses(all);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // derive category options from loaded data
  const categoryOptions = [
    "All",
    ...Array.from(new Set(excuses.map((e) => e.categoryName))),
  ];

  // filter excuses based on selection
  const displayedExcuses =
    selectedCategory === "All"
      ? excuses
      : excuses.filter((e) => e.categoryName === selectedCategory);

  if (loading) return <p className={classes.loading}>Loading excuses…</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <>
      <div className={classes.filterContainer}>
        <label htmlFor="category-filter">Filter by category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={classes.filterSelect}
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className={classes.container}>
        {displayedExcuses.map((exc) => (
          <div key={exc.excuseId} className={classes.excuseCard}>
            <h4 className={classes.context}>
              {exc.categoryName} — {exc.situationName}
            </h4>
            <p className={classes.excuseText}>{exc.excuseDescription}</p>
            <small className={classes.meta}>
              Format: {exc.format} · {exc.characteristics.join(", ")}
            </small>
          </div>
        ))}
      </div>
    </>
  );
}

export default AllExcuses;
