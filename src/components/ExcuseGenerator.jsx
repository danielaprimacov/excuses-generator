import { useState } from "react";

import classes from "./ExcuseGenerator.module.css";

function ExcuseGenerator() {
  const [userSituationInput, setUserSituationInput] = useState("");
  const [tone, setTone] = useState("Realistic");
  const [format, setFormat] = useState("");
  const [excuse, setExcuse] = useState(null);
  const [error, setError] = useState("");

  async function getAllExcusesFromAllSituations() {
    const res = await fetch("http://localhost:5000/categories");
    const categories = await res.json();

    const allExcuses = categories.flatMap((category) =>
      category.situations.flatMap((situation) =>
        situation.excuses.map((excuse) => ({
          ...excuse,
          situationName: situation.situationName,
          situationDescription: situation.situationDescription,
          categoryName: category.categoryName,
        }))
      )
    );

    return allExcuses;
  }

  async function generateExcuseSmart({ situationKeyword, tone, format = "" }) {
    const allExcuses = await getAllExcusesFromAllSituations();

    let filtered = allExcuses.filter((excuse) =>
      excuse.characteristics.includes(tone)
    );

    if (format) {
      filtered = filtered.filter(
        (excuse) => excuse.format.toLowerCase() === format.toLowerCase()
      );
    }

    if (situationKeyword) {
      const keyword = situationKeyword.toLowerCase();
      filtered = filtered.filter(
        (excuse) =>
          excuse.situationName.toLowerCase().includes(keyword) ||
          excuse.situationDescription?.toLowerCase().includes(keyword)
      );
    }

    if (filtered.length === 0) {
      throw new Error("No matching excuses found for your situation.");
    }

    const selected = filtered[Math.floor(Math.random() * filtered.length)];

    return selected;
  }

  async function generateRandomExcuse() {
    const all = await getAllExcusesFromAllSituations();
    return all[Math.floor(Math.random() * all.length)];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setExcuse(null);
    setError("");

    try {
      const result = await generateExcuseSmart({
        situationKeyword: userSituationInput,
        tone,
        format,
      });
      setExcuse(result);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSurprise() {
    setExcuse(null);
    setError("");

    try {
      const result = await generateRandomExcuse();
      setExcuse(result);
    } catch (err) {
      setError("Something went wrong generating a random excuse.");
    }
  }

  return (
    <div className={classes["excuses-container"]}>
      <h1>Generate an Excuse</h1>

      <form onSubmit={handleSubmit}>
        <label>
          <strong>Describe Your Situation</strong> (e.g. "meeting", "birthday",
          "loan")
          <input
            className={classes["form-input"]}
            type="text"
            value={userSituationInput}
            onChange={(e) => setUserSituationInput(e.target.value)}
            placeholder="Type your situation..."
            required
          />
        </label>

        <br />
        <br />

        <label>
          <strong>Tone *</strong>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            required
          >
            <option value="Realistic">Realistic</option>
            <option value="Empathy">Empathy</option>
            <option value="Funny">Funny</option>
            <option value="Corporate">Corporate</option>
            <option value="Not Suspicious">Not Suspicious</option>
            <option value="Technical">Technical</option>
            <option value="Professional">Professional</option>
          </select>
        </label>

        <br />
        <br />

        <label>
          <strong>Format</strong> (optional)
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="">Any</option>
            <option value="Text">Text</option>
            <option value="Slack">Slack</option>
            <option value="Email">Email</option>
          </select>
        </label>

        <br />
        <br />
        <button className={classes.submit} type="submit">
          Generate Excuse
        </button>

        <button
          className={classes.surprise}
          type="button"
          onClick={handleSurprise}
        >
          🎲 Surprise Me
        </button>
      </form>

      {excuse && (
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
      )}

      {error && <p style={{ color: "red" }}>❌ {error}</p>}
    </div>
  );
}

export default ExcuseGenerator;
