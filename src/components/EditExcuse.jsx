import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchExcuse,
  fetchSituations,
  fetchCategories,
  updateExcuse,
} from "../utils/api";

import classes from "./EditExcuse.module.css";

export default function EditExcuse() {
  const { excuseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    excuseDescription: "",
    format: "",
    characteristics: [],
    situationId: "",
    categoryId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const excuseData = await fetchExcuse(excuseId);
        const situations = await fetchSituations();
        const categories = await fetchCategories();

        const sit =
          situations.find((s) => s.id === excuseData.situationId) || {};
        const cat = categories.find((c) => c.id === sit.categoryId) || {};

        setForm({
          excuseDescription: excuseData.excuseDescription || "",
          format: excuseData.format || "",
          characteristics: Array.isArray(excuseData.characteristics)
            ? excuseData.characteristics
            : [],
          situationId: sit.id || "",
          categoryId: cat.id || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [excuseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "characteristics") {
      setForm((f) => ({
        ...f,
        characteristics: value.split(",").map((s) => s.trim()),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateExcuse(excuseId, {
        excuseDescription: form.excuseDescription,
        format: form.format,
        characteristics: form.characteristics,
        situationId: form.situationId,
      });
      navigate("/admin/all-excuses");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={classes.loading}>Loading excuse…</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <div className={classes.formContainer}>
      <h2>Edit Excuse</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <label>
          Description:
          <textarea
            name="excuseDescription"
            value={form.excuseDescription}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Format:
          <input
            type="text"
            name="format"
            value={form.format}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Characteristics (comma-separated):
          <input
            type="text"
            name="characteristics"
            value={form.characteristics.join(", ")}
            onChange={handleChange}
          />
        </label>

        <div className={classes.actions}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button type="button" onClick={() => navigate("/admin/all-excuses")}>
            Cancel
          </button>
        </div>

        {error && <p className={classes.error}>Error: {error}</p>}
      </form>
    </div>
  );
}
