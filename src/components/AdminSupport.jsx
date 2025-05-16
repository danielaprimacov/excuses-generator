import { useState, useEffect, useContext } from "react";
import { fetchSupportTickets } from "../utils/api";
import { AuthContext } from "./AuthContext";

import classes from "./AdminSupport.module.css";

export default function AdminSupport() {
  const { user, openLoginModal } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (user.role !== "admin") return;

    fetchSupportTickets()
      .then((json) => setTickets(json.tickets || json))
      .catch((err) => console.error("Error fetching support tickets:", err));
  }, [user, openLoginModal]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Admin: Support Tickets</h1>
      <div className={classes.cardGrid}>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={classes.card}
            onClick={() => setSelected(ticket)}
          >
            <p className={classes.cardDate}>
              {new Date(ticket.date).toLocaleDateString()}
            </p>
            <p className={classes.cardUser}>{ticket.userName}</p>
            <p className={classes.cardSubject}>{ticket.subject}</p>
            <p className={classes.cardPreview}>
              {ticket.message.length > 100
                ? ticket.message.slice(0, 100) + "…"
                : ticket.message}
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <div className={classes.modalOverlay} onClick={() => setSelected(null)}>
          <div
            className={`${classes.modal} ${classes["modal-manage"]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Support Ticket</h1>
            <label>
              User:
              <input type="text" value={selected.userName} readOnly />
            </label>
            <label>
              Date:
              <input
                type="text"
                value={new Date(selected.date).toLocaleString()}
                readOnly
              />
            </label>
            <label>
              Subject:
              <input type="text" value={selected.subject} readOnly />
            </label>
            <label>
              Message:
              <textarea value={selected.message} readOnly rows={6} />
            </label>
            <div className={classes.modalButtons}>
              <button
                className={classes.cancelBtn}
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
