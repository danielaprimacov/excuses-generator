import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import classes from "./EditExcuse.module.css";

const API_URL = "http://localhost:5000/categories";

export default function EditExcuse() {
  const { categoryId, situationId, excuseId } = useParams();
  const navigate = useNavigate();
  const [excuse, setExcuse] = useState({
    excuseDescription: "",
    format: "",
    characteristics: [],
    categoryName: "",
    situationName: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchExcuse() {
      try {
        const res = await fetch(
          `${API_URL}/${categoryId}/situations/${situationId}/excuses/${excuseId}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setExcuse({
          excuseDescription: data.excuseDescription,
          format: data.format,
          characteristics: data.characteristics,
          categoryName: data.categoryName,
          situationName: data.situationName,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchExcuse();
  }, [situationId, excuseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "characteristics") {
      setExcuse((prev) => ({
        ...prev,
        characteristics: value.split(",").map((s) => s.trim()),
      }));
    } else {
      setExcuse((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `${API_URL}/${categoryId}/situations/${situationId}/excuses/${excuseId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(excuse),
        }
      );
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      navigate("/admin/all-excuses");
    } catch (err) {
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
        {/* … your form fields … */}
        <div className={classes.actions}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button type="button" onClick={() => navigate("/admin/all-excuses")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
