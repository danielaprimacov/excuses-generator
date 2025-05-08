import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./EditExcuse.module.css";

const API_URL = "http://localhost:5000";

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
        // 1) Fetch the excuse, its situation, and its category in parallel
        const excuseRes = await fetch(`${API_URL}/excuses/${excuseId}`);
        if (!excuseRes.ok)
          throw new Error(`Excuse fetch failed (${excuseRes.status})`);
        const excuseData = await excuseRes.json();

        const [sitRes, catRes] = await Promise.all([
          fetch(`${API_URL}/situations/${excuseData.situationId}`),
          // we'll fetch the situation first to get its categoryId
        ]);

        if (!sitRes.ok)
          throw new Error(`Situation fetch failed (${sitRes.status})`);
        const sitData = await sitRes.json();

        const categoryRes = await fetch(
          `${API_URL}/categories/${sitData.categoryId}`
        );
        if (!categoryRes.ok)
          throw new Error(`Category fetch failed (${categoryRes.status})`);
        const catData = await categoryRes.json();

        // 2) Seed our form state
        setForm({
          excuseDescription: excuseData.excuseDescription,
          format: excuseData.format,
          characteristics: excuseData.characteristics,
          situationId: sitData.id,
          categoryId: catData.id,
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
      // PUT only to /excuses/:id
      const res = await fetch(`${API_URL}/excuses/${excuseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          excuseDescription: form.excuseDescription,
          format: form.format,
          characteristics: form.characteristics,
          situationId: form.situationId,
        }),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
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

        {/* If you need to allow changing situation or category, you'd
            fetch lists of those and render as <select> here. Otherwise
            we're keeping them read-only: */}
        <div className={classes.readOnlyField}>
          <label>Situation ID:</label>
          <span>{form.situationId}</span>
        </div>

        <div className={classes.readOnlyField}>
          <label>Category ID:</label>
          <span>{form.categoryId}</span>
        </div>

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
