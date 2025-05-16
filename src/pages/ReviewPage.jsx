import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";

import Review from "../components/Review";
import { fetchReviews, createReview } from "../utils/api";

function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    excuseId: "",
    rating: 5,
    comment: "",
  });
  const [showForm, setShowForm] = useState(false);
  
    const { user } = useContext(AuthContext);

  // Load reviews
  useEffect(() => {
    fetchReviews()
      .then((json) => setReviews(json.reviews || json))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userName: user.username,
        excuseId: parseInt(form.excuseId, 10),
        rating: parseInt(form.rating, 10),
        comment: form.comment,
        date: new Date().toISOString(),
      };
      const newReview = await createReview(payload);
      setReviews((prev) => [...prev, newReview]);
      setForm({ userName: "", excuseId: "", rating: 5, comment: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  return (
    <Review
      reviews={reviews}
      form={form}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      showForm={showForm}
      setShowForm={setShowForm}
    />
  );
}

export default ReviewPage;
