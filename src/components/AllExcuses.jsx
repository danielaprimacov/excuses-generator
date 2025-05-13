import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchCategories,
  fetchExcuses,
  fetchSituations,
  deleteExcuse,
} from "../utils/api";
import classes from "./AllExcuses.module.css";

export default function AllExcuses() {
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExcuse, setSelectedExcuse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        // kick off all three requests in parallel
        const [categories, situations, excusesData] = await Promise.all([
          fetchCategories(),
          fetchSituations(),
          fetchExcuses(),
        ]);

        // build lookup maps
        const catMap = new Map(categories.map((c) => [c.id, c.categoryName]));
        const sitMap = new Map(
          situations.map((s) => [
            s.id,
            {
              situationName: s.situationDescription,
              categoryId: s.categoryId,
            },
          ])
        );

        // enrich each excuse
        const all = excusesData.map((e) => {
          const sit = sitMap.get(e.situationId) || {};
          return {
            ...e,
            categoryId: sit.categoryId,
            situationName: sit.situationName || "Unknown",
            categoryName: catMap.get(sit.categoryId) || "Uncategorized",
          };
        });

        setExcuses(all);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p className={classes.loading}>Loading excuses…</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  const categoryOptions = [
    "All",
    ...Array.from(new Set(excuses.map((e) => e.categoryName))),
  ];
  const displayed =
    selectedCategory === "All"
      ? excuses
      : excuses.filter((e) => e.categoryName === selectedCategory);

  const handleCardClick = (exc) => {
    setSelectedExcuse(exc);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedExcuse(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Really delete?")) return;

    try {
      const { categoryId, situationId } = selectedExcuse;

      // call the helper function
      await deleteExcuse(categoryId, situationId, id);

      setExcuses((prev) => prev.filter((e) => e.id !== id));
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Delete error: " + err.message);
    }
  };

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
        {displayed.map((exc) => (
          <div
            key={exc.id}
            className={classes.excuseCard}
            onClick={() => handleCardClick(exc)}
          >
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

      {showModal && selectedExcuse && (
        <div className={classes.modalOverlay} onClick={handleClose}>
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedExcuse.excuseDescription}</h2>
            <p>
              <strong>Category:</strong> {selectedExcuse.categoryName}
            </p>
            <p>
              <strong>Situation:</strong> {selectedExcuse.situationName}
            </p>
            <p>
              <strong>Format:</strong> {selectedExcuse.format}
            </p>
            <p>
              <strong>Characteristics:</strong>{" "}
              {selectedExcuse.characteristics.join(", ")}
            </p>
            <div className={classes.modalActions}>
              <button
                onClick={() =>
                  navigate(
                    `/admin/edit/${selectedExcuse.categoryId}/${selectedExcuse.situationId}/${selectedExcuse.id}`
                  )
                }
              >
                Edit
              </button>
              <button onClick={() => handleDelete(selectedExcuse.id)}>
                Delete
              </button>
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
