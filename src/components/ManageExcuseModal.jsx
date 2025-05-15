import { useState, useEffect } from "react";
import { fetchCategories, fetchExcuses, fetchSituations } from "../utils/api";

import classes from "./Modal.module.css";

const ADMIN_EMAIL = "daniela.primacov@yahoo.com";

export default function ManageExcuseModal({ onClose }) {
  const [step, setStep] = useState("choose"); // "choose" | "add" | "edit" | "delete"
  const [categories, setCategories] = useState([]);
  const [situations, setSituations] = useState([]);
  const [excuses, setExcuses] = useState([]);

  const [form, setForm] = useState({
    // for add:
    newSituationDesc: "",
    newCategoryId: "",
    newTone: "",
    newFormat: "",
    // for edit/delete:
    selectedSituationId: "",
    selectedExcuseId: "",
    editDescription: "",
  });

  useEffect(() => {
    fetchSituations().then(setSituations);
    fetchCategories().then(setCategories);
    fetchExcuses().then(setExcuses);
  }, []);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function sendMail(subject, body) {
    const mailto =
      `mailto:${ADMIN_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === "add") {
      sendMail(
        "Request: Add New Excuse",
        `Please ADD a new excuse with:\n` +
          `• Situation: ${form.newSituationDesc}\n` +
          `• Category ID: ${form.newCategoryId}\n` +
          `• Tone: ${form.newTone}\n` +
          `• Format: ${form.newFormat}\n`
      );
    }

    if (step === "edit") {
      const chosen = excuses.find((x) => x.id === form.selectedExcuseId);
      sendMail(
        "Request: Edit Excuse",
        `Please EDIT in situation ID ${form.selectedSituationId}:\n` +
          `• Excuse ID: ${form.selectedExcuseId}\n` +
          `• Old Text: ${chosen?.excuseDescription}\n` +
          `• New Text: ${form.editDescription}\n`
      );
    }

    if (step === "delete") {
      const chosen = excuses.find((x) => x.id === form.selectedExcuseId);
      sendMail(
        "Request: Delete Excuse",
        `Please DELETE in situation ID ${form.selectedSituationId}:\n` +
          `• Excuse ID: ${form.selectedExcuseId}\n` +
          `• Text: ${chosen?.excuseDescription}\n`
      );
    }

    onClose();
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={`${classes.modal} ${classes["modal-manage"]}`}>
        <button onClick={onClose} className={classes.close}>
          ×
        </button>

        {step === "choose" && (
          <>
            <h2>What would you like to do?</h2>
            <button onClick={() => setStep("add")}>Add a New Excuse</button>
            <button onClick={() => setStep("edit")}>Edit an Excuse</button>
            <button onClick={() => setStep("delete")}>Delete an Excuse</button>
          </>
        )}

        {(step === "add" || step === "edit" || step === "delete") && (
          <form onSubmit={handleSubmit}>
            {step === "add" && (
              <>
                <h3>Add New Excuse</h3>
                <label>
                  Situation description
                  <input
                    name="newSituationDesc"
                    value={form.newSituationDesc}
                    onChange={onChange}
                    required
                  />
                </label>
                <label>
                  Category
                  <select
                    name="newCategoryId"
                    value={form.newCategoryId}
                    onChange={onChange}
                    required
                  >
                    <option value="">– choose one –</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Tone
                  <input
                    name="newTone"
                    value={form.newTone}
                    onChange={onChange}
                    required
                  />
                </label>
                <label>
                  Format
                  <input
                    name="newFormat"
                    value={form.newFormat}
                    onChange={onChange}
                    required
                  />
                </label>
              </>
            )}

            {(step === "edit" || step === "delete") && (
              <>
                <h3>
                  {step === "edit" ? "Edit an Excuse" : "Delete an Excuse"}
                </h3>

                {/* 1️⃣ Pick Situation */}
                <label>
                  Pick Situation
                  <select
                    name="selectedSituationId"
                    value={form.selectedSituationId}
                    onChange={onChange}
                    required
                  >
                    <option value="">– pick one –</option>
                    {situations.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.situationName}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Then pick Excuse filtered by that situation */}
                <label>
                  Pick Excuse
                  <select
                    name="selectedExcuseId"
                    value={form.selectedExcuseId}
                    onChange={onChange}
                    required
                    disabled={!form.selectedSituationId}
                  >
                    <option value="">– pick one –</option>
                    {excuses
                      .filter(
                        (e) =>
                          e.situationId === Number(form.selectedSituationId)
                      )
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.excuseDescription}
                        </option>
                      ))}
                  </select>
                </label>

                {/* For “edit,” ask for the new text */}
                {step === "edit" && (
                  <label>
                    New Description
                    <input
                      name="editDescription"
                      value={form.editDescription}
                      onChange={onChange}
                      required
                    />
                  </label>
                )}
              </>
            )}

            <div className={classes.modalButtons}>
              <button
                type="button"
                className={classes["cancel-btn"]}
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className={classes["submit-btn"]}>
                Send to Admin
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
