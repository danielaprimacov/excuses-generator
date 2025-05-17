const API_URL = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`${res.status} ‐ ${errorText}`);
  }
  return res.json();
}

export function fetchCategories() {
  return request("/categories");
}

export function fetchSituations() {
  return request("/situations");
}

export function fetchExcuses() {
  return request("/excuses");
}

export function fetchReviews() {
  return request("/reviews");
}

export function createReview(payload) {
  return request("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Fetch newest excuses
export function fetchLatestExcuses({ sort = "id", order = "desc" } = {}) {
  return request(`/excuses?_sort=${sort}&_order=${order}`);
}

export function createCategory(name) {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify({ categoryName: name }),
  });
}
export function createSituation(categoryId, name) {
  return request("/situations", {
    method: "POST",
    body: JSON.stringify({ categoryId, situationName: name }),
  });
}
export function createExcuse(payload) {
  return request("/excuses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchExcuse(id) {
  return request(`/excuses/${id}`);
}

export function deleteExcuse(id) {
  return request(`/excuses/${id}`, {
    method: "DELETE",
  });
}

export function updateExcuse(id, payload) {
  return request(`/excuses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Submit a new support ticket.
 *
 * @param {{ userName: string, subject: string, message: string, date: string }} payload
 */
export function createSupportTicket(payload) {
  return request("/support-tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchSupportTickets() {
  return request("/support-tickets");
}
