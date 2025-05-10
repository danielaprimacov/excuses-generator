import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import classes from "./Modal.module.css";

export default function LoginModal({ onClose }) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = login({ username, password });
    if (!res.ok) {
      return setError(res.message);
    }
    onClose();
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modal}>
        <h2>Login</h2>
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
            <button type="submit">Login</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
