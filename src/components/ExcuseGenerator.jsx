import { useState } from "react";
import classes from "./ExcuseGenerator.module.css";

function ExcuseGenerator() {
  const [step, setStep] = useState(0);
  const [situationInput, setSituationInput] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [format, setFormat] = useState("");
  const [excuse, setExcuse] = useState(null);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/categories";

  const toneOptions = [
    "Dramatic",
    "Realistic",
    "Not Suspicious",
    "Empathy",
    "LinkedIn Tone",
    "Funny",
  ];
  const formatOptions = ["Slack", "Email", "Text", "SMS", "Phone Call"];

  const fetchAllExcuses = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch excuses.");
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

  const filterExcuses = (all) => {
    return all.filter((e) => {
      if (
        criteria.length &&
        !criteria.every((c) => e.characteristics.includes(c))
      ) {
        return false;
      }
      if (format && e.format.toLowerCase() !== format.toLowerCase()) {
        return false;
      }
      if (situationInput.trim()) {
        const keywords = situationInput
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w);
        const name = e.situationName.toLowerCase();
        const desc = (e.situationDescription || "").toLowerCase();
        const matchCount = keywords.reduce((count, word) => {
          if (name.includes(word) || desc.includes(word)) {
            return count + 1;
          }
          return count;
        }, 0);
        if (matchCount < 2) {
          return false;
        }
      }
      return true;
    });
  };

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const resetAll = () => {
    setStep(0);
    setSituationInput("");
    setCriteria([]);
    setFormat("");
    setExcuse(null);
    setError("");
  };

  const generateExcuse = async () => {
    setError("");
    setExcuse(null);
    try {
      const all = await fetchAllExcuses();
      const filtered = filterExcuses(all);
      if (!filtered.length) throw new Error("No matching excuses found.");
      setExcuse(pickRandom(filtered));
      setStep(3);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={classes["excuses-container"]}>
      <h1>Generate an Excuse</h1>

      {step === 0 && (
        <form
          className={classes.step}
          onSubmit={(e) => {
            e.preventDefault();
            setStep(1);
          }}
        >
          <h2>Describe Your Situation</h2>
          <textarea
            value={situationInput}
            onChange={(e) => setSituationInput(e.target.value)}
            placeholder="e.g., 'I missed my friend's birthday dinner...'"
            className={classes.textarea}
            required
          />
          <button type="submit" className={classes.nextBtn}>
            Next
          </button>
        </form>
      )}

      {step === 1 && (
        <div className={classes.step}>
          <h2>Select Excuse Tone</h2>
          <div className={classes["choice-button"]}>
            {toneOptions.map((t) => (
              <button
                key={t}
                type="button"
                className={`${classes.choiceButton} ${
                  criteria.includes(t) ? classes.selected : ""
                }`}
                onClick={() => {
                  setCriteria([t]);
                  setStep(2);
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={classes.step}>
          <h2>Select Format</h2>
          <div className={classes["format-button"]}>
            {formatOptions.map((f) => (
              <button
                key={f}
                type="button"
                className={`${classes.choiceButton} ${
                  format === f ? classes.selected : ""
                }`}
                onClick={() => {
                  setFormat(f);
                  generateExcuse();
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && excuse && (
        <div className={classes["excuse-show"]}>
          <div className={classes.excuse}>
            <h2>🧾 Excuse:</h2>
            <p>
              <strong>{excuse.excuseDescription}</strong>
            </p>
            <p>
              <em>
                From: {excuse.situationName} ({excuse.categoryName})
              </em>
            </p>
          </div>
          <button className={classes.submitBtn} onClick={resetAll}>
            Start Over
          </button>
        </div>
      )}

      {error && (
        <div className={classes.step}>
          <p className={classes.error}>❌ {error}</p>
          <button className={classes.submitBtn} onClick={resetAll}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}

export default ExcuseGenerator;
