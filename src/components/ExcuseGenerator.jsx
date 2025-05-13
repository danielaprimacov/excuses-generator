import { useState } from "react";

import { fetchCategories, fetchSituations, fetchExcuses } from "../utils/api";
import classes from "./ExcuseGenerator.module.css";

function ExcuseGenerator() {
  const [step, setStep] = useState(0);
  const [situationInput, setSituationInput] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [format, setFormat] = useState("");
  const [excuse, setExcuse] = useState(null);
  const [error, setError] = useState("");

  const toneOptions = [
    "Dramatic",
    "Realistic",
    "Not Suspicious",
    "Empathy",
    "LinkedIn Tone",
    "Funny",
  ];
  const formatOptions = ["Slack", "Email", "Text", "SMS", "Phone Call"];

  // load and join all three resources
  const fetchAllExcuses = async () => {
    const [categories, situations, excuses] = await Promise.all([
      fetchCategories(),
      fetchSituations(),
      fetchExcuses(),
    ]);

    const catMap = new Map(categories.map((cat) => [cat.id, cat.categoryName]));
    const sitMap = new Map(
      situations.map((sit) => [
        sit.id,
        {
          name: sit.situationName,
          desc: sit.situationDescription,
          categoryId: sit.categoryId,
        },
      ])
    );

    return excuses.map((e) => {
      const sit = sitMap.get(e.situationId) || {};
      return {
        ...e,
        situationName: sit.name,
        situationDescription: sit.desc,
        categoryName: catMap.get(sit.categoryId),
      };
    });
  };

  const filterExcuses = (all) => {
    // 1. Define a small stop-word list:
    const stopWords = new Set([
      "i",
      "me",
      "my",
      "you",
      "your",
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "to",
      "on",
      "in",
      "at",
      "for",
      "of",
      "missed",
      "did",
      "didnt",
      "was",
      "were",
    ]);

    // 2. Build meaningful keywords from the user’s input:
    const keywords = situationInput
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // strip punctuation
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    return all.filter((e) => {
      // tone/format filtering stays the same
      if (
        criteria.length &&
        !criteria.every((c) => e.characteristics.includes(c))
      ) {
        return false;
      }
      if (format && e.format.toLowerCase() !== format.toLowerCase()) {
        return false;
      }

      // 3. If the user typed something, require at least one meaningful keyword match
      if (keywords.length) {
        const name = (e.situationName || "").toLowerCase();
        const desc = (e.situationDescription || "").toLowerCase();

        const hasMatch = keywords.some(
          (w) => name.includes(w) || desc.includes(w)
        );
        if (!hasMatch) return false;
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
      if (filtered.length === 0) {
        throw new Error("No matching excuses found.");
      }
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
