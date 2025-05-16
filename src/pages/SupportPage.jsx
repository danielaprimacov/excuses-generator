import React, { useState, useContext } from "react";
import Support from "../components/Support";
import { createSupportTicket } from "../utils/api";
import { AuthContext } from "../components/AuthContext";

function SupportPage() {
  const { user, openLoginModal } = useContext(AuthContext);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openLoginModal();
      return;
    }

    try {
      await createSupportTicket({
        userName: user.username,
        subject: form.subject,
        message: form.message,
        date: new Date().toISOString(),
      });
      setStatus("success");
      setForm({ subject: "", message: "" });
    } catch (err) {
      console.error("Support ticket error:", err);
      setStatus("error");
    }
  };

  return (
    <Support
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      status={status}
      user={user}
      form={form}
    />
  );
}

export default SupportPage;
