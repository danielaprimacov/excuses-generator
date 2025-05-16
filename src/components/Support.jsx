import classes from "./Support.module.css";

export default function Support({
  handleChange,
  handleSubmit,
  status,
  user,
  form,
  openLoginModal,
}) {
  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Support</h1>

      {!user && (
        <button className={classes.loginButton} onClick={openLoginModal}>
          Log in to submit a request
        </button>
      )}

      {user && (
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes["form-input"]}>
            <label>
              Subject:
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={classes["form-input"]}>
            <label>
              Message:
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
              />
            </label>
          </div>
          <button type="submit" className={classes.submitButton}>
            Submit Ticket
          </button>

          {status === "success" && (
            <p className={classes.success}>Your request has been submitted!</p>
          )}
          {status === "error" && (
            <p className={classes.error}>Failed to send. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}
