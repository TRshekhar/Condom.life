import axios from "axios";

const api = axios.create({
  baseURL: "https://condom-life-backend.onrender.com/api/",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.errors?.[0] ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const reviewsApi = {
  getAll: (params) => api.get("/reviews", { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post("/reviews", data),
  like: (id) => api.post(`/reviews/${id}/like`),
};

export const brandsApi = {
  getAll: () => api.get("/brands"),
  getStats: (slug) => api.get(`/brands/${slug}/stats`),
};

export const statsApi = {
  getGlobal: () => api.get("/stats"),
};

export default api;
