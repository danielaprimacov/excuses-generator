import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./AddNewExcuse.module.css";

const API_URL = "http://localhost:5000";

function AddNewExcuse() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [situations, setSituations] = useState([]);
  const [form, setForm] = useState({
    categoryChoice: "",
    newCategoryName: "",
    situationChoice: "",
    newSituationName: "",
    excuseDescription: "",
    format: "",
    characteristics: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLookups() {
      try {
        const [catsRes, sitsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/situations`),
        ]);
        if (!catsRes.ok)
          throw new Error(`Categories fetch failed (${catsRes.status})`);
        if (!sitsRes.ok)
          throw new Error(`Situations fetch failed (${sitsRes.status})`);
        const [catsData, sitsData] = await Promise.all([
          catsRes.json(),
          sitsRes.json(),
        ]);
        setCategories(catsData);
        setSituations(sitsData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadLookups();
  }, []);

  // filter only the situations belonging to the chosen category
  const filteredSituations = situations.filter(
    (s) => String(s.categoryId) === form.categoryChoice
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "categoryChoice") {
        // reset situation whenever category changes
        next.situationChoice = "";
        next.newSituationName = "";
      }
      if (name === "situationChoice") {
        // clear any typed‐in newSituationName
        next.newSituationName = "";
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // 1) maybe create new category
      let categoryId;
      if (form.categoryChoice === "new") {
        const res = await fetch(`${API_URL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryName: form.newCategoryName.trim() }),
        });
        if (!res.ok) throw new Error(`Create category failed (${res.status})`);
        const data = await res.json();
        categoryId = data.id;
      } else {
        categoryId = parseInt(form.categoryChoice, 10);
      }

      // 2) maybe create new situation
      let situationId;
      if (form.situationChoice === "new") {
        const name = form.newSituationName.trim();
        const res = await fetch(`${API_URL}/situations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId, situationName: name }),
        });
        if (!res.ok) throw new Error(`Create situation failed (${res.status})`);
        const data = await res.json();
        situationId = data.id;
      } else {
        situationId = parseInt(form.situationChoice, 10);
      }

      // 3) finally create the excuse
      const payload = {
        situationId,
        excuseDescription: form.excuseDescription.trim(),
        format: form.format.trim(),
        characteristics: form.characteristics
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };
      const res = await fetch(`${API_URL}/excuses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save excuse failed (${res.status})`);

      navigate("/admin/all-excuses");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={classes.loading}>Loading…</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <div className={classes.formContainer}>
      <h2>Add New Excuse</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        {/* Category picker */}
        <div className={classes.field}>
          <label htmlFor="categoryChoice">Category:</label>
          <select
            id="categoryChoice"
            name="categoryChoice"
            value={form.categoryChoice}
            onChange={handleChange}
            className={classes.select}
            required
          >
            <option value="">— Select Category —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.categoryName}
              </option>
            ))}
            <option value="new">+ Add New Category</option>
          </select>
        </div>

        {form.categoryChoice === "new" && (
          <div className={classes.field}>
            <label htmlFor="newCategoryName">New Category Name:</label>
            <input
              id="newCategoryName"
              name="newCategoryName"
              value={form.newCategoryName}
              onChange={handleChange}
              className={classes.input}
              required
            />
          </div>
        )}

        {/* Situation picker */}
        <div className={classes.field}>
          <label htmlFor="situationChoice">Situation:</label>
          <select
            id="situationChoice"
            name="situationChoice"
            value={form.situationChoice}
            onChange={handleChange}
            className={classes.select}
            required
            disabled={!form.categoryChoice}
          >
            <option value="">— Select Situation —</option>
            {filteredSituations.map((sit) => (
              <option key={sit.id} value={String(sit.id)}>
                {sit.situationName}
              </option>
            ))}
            <option value="new">+ Add New Situation</option>
          </select>
        </div>

        {form.situationChoice === "new" && (
          <div className={classes.field}>
            <label htmlFor="newSituationName">New Situation Name:</label>
            <input
              id="newSituationName"
              name="newSituationName"
              value={form.newSituationName}
              onChange={handleChange}
              className={classes.input}
              required
            />
          </div>
        )}

        {/* Excuse details */}
        <div className={classes.field}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="excuseDescription"
            value={form.excuseDescription}
            onChange={handleChange}
            className={classes.textarea}
            required
          />
        </div>

        <div className={classes.field}>
          <label htmlFor="format">Format:</label>
          <input
            id="format"
            type="text"
            name="format"
            value={form.format}
            onChange={handleChange}
            className={classes.input}
            required
          />
        </div>

        <div className={classes.field}>
          <label htmlFor="chars">Characteristics (comma-separated):</label>
          <input
            id="chars"
            type="text"
            name="characteristics"
            value={form.characteristics}
            onChange={handleChange}
            className={classes.input}
          />
        </div>

        <div className={classes.actions}>
          <button
            type="submit"
            disabled={saving}
            className={`${classes.button} ${classes.submitButton}`}
          >
            {saving ? "Saving…" : "Add Excuse"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/all-excuses")}
            className={`${classes.button} ${classes.cancelButton}`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNewExcuse;
