import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./AllExcuses.module.css";

const API_URL = "http://localhost:5000/categories";

export default function AllExcuses() {
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExcuse, setSelectedExcuse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const categories = Array.isArray(data)
          ? data
          : Array.isArray(data.categories)
          ? data.categories
          : [];

        // include situationId on each excuse
        const all = categories.flatMap(
          (cat) =>
            cat.situations?.flatMap((sit) =>
              sit.excuses.map((exc) => ({
                ...exc,
                categoryId: cat.categoryId,
                situationId: sit.situationId,
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

  const handleCardClick = (exc) => {
    setSelectedExcuse(exc);
    setShowModal(true);
    // navigate using situationId
    navigate(
      `/admin/edit/${exc.situationId}/${exc.excuseId}``/admin/edit/${exc.categoryId}/${exc.situationId}/${exc.excuseId}`
    );
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedExcuse(null);
    navigate("/admin/all-excuses");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this excuse?")) return;
    try {
      // delete via situation/:situationId/excuses/:id
      const res = await fetch(
        `${API_URL}/${selectedExcuse.categoryId}/situations/${selectedExcuse.situationId}/excuses/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setExcuses((prev) => prev.filter((e) => e.excuseId !== id));
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Error deleting excuse: " + err.message);
    }
  };

  // derive category options
  const categoryOptions = [
    "All",
    ...Array.from(new Set(excuses.map((e) => e.categoryName))),
  ];

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
          <div
            key={exc.excuseId}
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
                    `/admin/edit/${selectedExcuse.categoryId}/${selectedExcuse.situationId}/${selectedExcuse.excuseId}`
                  )
                }
              >
                Edit
              </button>
              <button onClick={() => handleDelete(selectedExcuse.excuseId)}>
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
