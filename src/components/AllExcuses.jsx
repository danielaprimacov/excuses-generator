import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./AllExcuses.module.css";

const API_URL = "http://localhost:5000";

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
        // Fetch all three resources in parallel
        const [catsRes, sitsRes, excsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/situations`),
          fetch(`${API_URL}/excuses`),
        ]);
        if (!catsRes.ok)
          throw new Error(`Categories fetch failed (${catsRes.status})`);
        if (!sitsRes.ok)
          throw new Error(`Situations fetch failed (${sitsRes.status})`);
        if (!excsRes.ok)
          throw new Error(`Excuses fetch failed (${excsRes.status})`);

        const [categories, situations, excusesData] = await Promise.all([
          catsRes.json(),
          sitsRes.json(),
          excsRes.json(),
        ]);

        // Build lookup maps
        const catMap = new Map(categories.map((c) => [c.id, c.categoryName]));
        const sitMap = new Map(
          situations.map((s) => [
            s.id,
            {
              situationName: s.situationName,
              categoryId: s.categoryId,
              situationNameRaw: s.situationName,
            },
          ])
        );

        // Flatten and enrich
        const all = excusesData.map((e) => {
          const sit = sitMap.get(e.situationId) || {};
          return {
            ...e,
            categoryId: sit.categoryId,
            situationName: sit.situationNameRaw,
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
      const res = await fetch(
        `${API_URL}/categories/${categoryId}/situations/${situationId}/excuses/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
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
