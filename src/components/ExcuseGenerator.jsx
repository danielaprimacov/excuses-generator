import { useState } from "react";

import classes from "./ExcuseGenerator.module.css";

function ExcuseGenerator() {
  const [userSituationInput, setUserSituationInput] = useState("");
  const [tone, setTone] = useState("Realistic");
  const [format, setFormat] = useState("");
  const [excuse, setExcuse] = useState(null);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/categories";

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

  // Filter logic by tone, format, and all keywords in the situation input
  const filterExcuses = (excuses, { situationKeyword, tone, format }) => {
    let filtered = [...excuses];

    // Filter by tone
    if (tone) {
      filtered = filtered.filter((e) => e.characteristics.includes(tone));
    }

    // Filter by format
    if (format) {
      const fmt = format.toLowerCase();
      filtered = filtered.filter((e) => e.format.toLowerCase() === fmt);
    }

    // Filter by every keyword in the situation input
    if (situationKeyword) {
      const keywords = situationKeyword
        .toLowerCase()
        .split(/\s+/) // split on whitespace
        .filter((w) => w); // remove empty strings

      filtered = filtered.filter((e) => {
        const name = e.situationName.toLowerCase();
        const desc = (e.situationDescription || "").toLowerCase();

        // each keyword must appear in either name or description
        return keywords.every(
          (word) => name.includes(word) || desc.includes(word)
        );
      });
    }

    return filtered;
  };

  // Pick a random element from an array
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Generate an excuse matching filters
  const generateExcuseSmart = async (options) => {
    const all = await fetchAllExcuses();
    const filtered = filterExcuses(all, options);
    if (filtered.length === 0) {
      throw new Error("No matching excuses found for your situation.");
    }
    return pickRandom(filtered);
  };

  // Generate a completely random excuse
  const generateRandomExcuse = async () => {
    const all = await fetchAllExcuses();
    return pickRandom(all);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
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
  };

  // Handle “Surprise Me” click
  const handleSurprise = async () => {
    setExcuse(null);
    setError("");
    try {
      const result = await generateRandomExcuse();
      setExcuse(result);
    } catch {
      setError("Something went wrong generating a random excuse.");
    }
  };

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
          Surprise Me
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
