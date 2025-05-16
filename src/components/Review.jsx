import { useContext } from "react";

import { AuthContext } from "./AuthContext";
import classes from "./Review.module.css";

function Review({
  reviews,
  form,
  handleSubmit,
  handleChange,
  showForm,
  setShowForm,
}) {
  const { user, openLoginModal } = useContext(AuthContext);

  const handleToggle = () => {
    if (!user) {
      openLoginModal();
    } else {
      setShowForm((show) => !show);
    }
  };

  return (
    <div className={classes.container}>
      <button className={classes.toggleButton} onClick={handleToggle}>
        {showForm ? "Cancel" : "Add a New Review"}
      </button>

      {showForm && user && (
        <form onSubmit={handleSubmit} className={classes.form}>
          <h2 className={classes.subheading}>Add a Review</h2>
          <div className={classes["form-input"]}>
            <label>
              Rating:
              <select name="rating" value={form.rating} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={classes["form-input"]}>
            <label>
              Comment:
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                required
                rows={3}
              />
            </label>
          </div>
          <button type="submit" className={classes.submitButton}>
            Submit Review
          </button>
        </form>
      )}
      <h1 className={classes.heading}>User Reviews</h1>
      <div className={classes.list}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className={classes.reviewCard}>
              <div className={classes.reviewHeader}>
                <span className={classes.userName}>{review.userName}</span>
                <span className={classes.rating}>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className={classes.comment}>{review.comment}</p>
              <p className={classes.date}>
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className={classes.noReviews}>No reviews available.</p>
        )}
      </div>
    </div>
  );
}

export default Review;
