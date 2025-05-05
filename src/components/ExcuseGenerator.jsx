import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./ExcuseGenerator.module.css";

function ExcuseGenerator() {
  const [step, setStep] = useState(0);
  const [priority, setPriority] = useState("");
  const [userRole, setUserRole] = useState("");
  const [bossRole, setBossRole] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [situationInput, setSituationInput] = useState("");
  const [excuse, setExcuse] = useState(null);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/categories";
  const navigate = useNavigate();

  // Fetch and flatten all excuses from categories → situations → excuses
  const fetchAllExcuses = async () => {
    const response = await fetch(API_URL);
    const categories = await response.json();
    return categories.flatMap((category) =>
      category.situations.flatMap((situation) =>
        situation.excuses.map((exc) => ({
          ...exc,
          situationName: situation.situationName,
          situationDescription: situation.situationDescription,
          categoryName: category.categoryName,
        }))
      )
    );
  };

  // Filter logic by criteria and keywords
  const filterExcuses = (excuses, { situationKeyword, criteria }) => {
    let filtered = [...excuses];

    // Filter by each selected criterion (e.g., "Realistic", "Not Suspicious")
    if (criteria.length) {
      filtered = filtered.filter((e) =>
        criteria.every((c) => e.characteristics.includes(c))
      );
    }

    // Filter by every keyword in the situation input
    if (situationKeyword) {
      const keywords = situationKeyword
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w);

      filtered = filtered.filter((e) => {
        const name = e.situationName.toLowerCase();
        const desc = (e.situationDescription || "").toLowerCase();
        return keywords.every(
          (word) => name.includes(word) || desc.includes(word)
        );
      });
    }

    return filtered;
  };

  // Pick a random element
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Generate excuse using current inputs
  const generateExcuse = async () => {
    setError("");
    setExcuse(null);
    try {
      const all = await fetchAllExcuses();
      const filtered = filterExcuses(all, {
        situationKeyword: situationInput,
        criteria,
      });
      if (!filtered.length) throw new Error("No matching excuses found.");
      setExcuse(pickRandom(filtered));
    } catch (err) {
      setError(err.message);
    }
  };

  // Handlers for each step
  const handleCriteriaToggle = (c) => {
    setCriteria((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  // Render wizard step
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className={classes.step}>
            <h2>Select Priority Level</h2>
            {[
              { label: "Super urgent (in an hour)", value: "1h" },
              { label: "High (today)", value: "today" },
              { label: "Medium (this week)", value: "week" },
              { label: "Low (1 week)", value: "1w" },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`${classes.choiceButton} ${priority === opt.value ? classes.selected : ''}`}
                onClick={() => { setPriority(opt.value); setStep(step + 1); }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );

      case 1:
        return (
          <div className={classes.step}>
            <h2>Select Your Role</h2>
            {["Employee", "Student", "Freelancer", "Parent"].map((role) => (
              <button
                key={role}
                className={`${classes.choiceButton} ${userRole === role ? classes.selected : ''}`}
                onClick={() => { setUserRole(role); setStep(step + 1); }}
              >
                {role}
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className={classes.step}>
            <h2>Select Boss' Role</h2>
            {["Manager", "Mom", "Husband", "Professor", "Team Lead"].map((b) => (
              <button
                key={b}
                className={`${classes.choiceButton} ${bossRole === b ? classes.selected : ''}`}
                onClick={() => { setBossRole(b); setStep(step + 1); }}
              >
                {b}
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className={classes.step}>
            <h2>Select Excuse Criteria</h2>
            {["Dramatic", "Realistic", "Not Suspicious", "Empathy", "LinkedIn Tone"].map((c) => (
              <button
                key={c}
                className={`${classes.choiceButton} ${criteria.includes(c) ? classes.selected : ''}`}
                onClick={() => handleCriteriaToggle(c)}
              >
                {c}
              </button>
            ))}
            <div className={classes.nextWrap}>
              <button
                className={classes.nextBtn}
                disabled={!criteria.length}
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <form
            className={classes.step}
            onSubmit={(e) => { e.preventDefault(); generateExcuse(); }}
          >
            <h2>Describe Your Situation</h2>
            <textarea
              value={situationInput}
              onChange={(e) => setSituationInput(e.target.value)}
              placeholder="e.g., 'I'm running late for a client meeting...'"
              className={classes.textarea}
              required
            />
            <button type="submit" className={classes.submitBtn}>
              Generate Excuse
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className={classes["excuses-container"]}>
      <h1>Generate an Excuse</h1>

      {renderStep()}

      {excuse && (
        <div className={classes.excuse}>
          <h2>🧾 Excuse:</h2>
          <p><strong>{excuse.excuseDescription}</strong></p>
          <p><em>From: {excuse.situationName} ({excuse.categoryName})</em></p>
        </div>
      )}

      {error && <p className={classes.error}>❌ {error}</p>}
    </div>
  );
}

export default ExcuseGenerator;