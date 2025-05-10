import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import classes from "./Modal.module.css";

export default function SignupModal({ onClose, onSwitch }) {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = signup({ username, password });
    if (!res.ok) {
      return setError(res.message);
    }
    onClose();
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modal}>
        <h1>Create Account</h1>
        <form onSubmit={submit}>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className={classes.error}>{error}</p>}
          <div className={classes.modalButtons}>
            <button className={classes["submit-btn"]} type="submit">
              Sign Up
            </button>
            <button
              className={classes["cancel-btn"]}
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
          <button className={classes["existing-acc-btn"]} type="button" onClick={onSwitch}>
            Already have an account?
          </button>
        </form>
      </div>
    </div>
  );
}
