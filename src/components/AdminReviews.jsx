import { useState, useEffect, useContext } from "react";
import { fetchReviews } from "../utils/api";
import { AuthContext } from "./AuthContext";

import classes from "./AdminReview.module.css";

export default function AdminReviews() {
  const { user, openLoginModal } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (user.role !== "admin") {
      return;
    }
    fetchReviews()
      .then((json) => setReviews(json.reviews || json))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [user]);

  // If not admin, render nothing (or you could show an unauthorized message)
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Admin: Reviews Overview</h1>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.headerCell}>Rating</th>
            <th className={classes.headerCell}>User</th>
            <th className={classes.headerCell}>Excuse ID</th>
            <th className={classes.headerCell}>Comment</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review.id}>
                <td className={classes.cell}>{review.rating}</td>
                <td className={classes.cell}>{review.userName}</td>
                <td className={classes.cell}>{review.excuseId}</td>
                <td className={classes.cell}>{review.comment}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className={`${classes.cell} ${classes.noData}`}>
                No reviews found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
