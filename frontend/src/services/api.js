import axios from "axios";

const API = axios.create({
  baseURL: "https://product-crud-production-2544.up.railway.app/api",
  headers: { "Content-Type": "application/json" },
});

// ── Categories ───────────────────────────────────────────────
export const getCategories = () => API.get("/categories");
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// ── Subcategories ────────────────────────────────────────────
export const getSubcategories = () => API.get("/subcategories");
export const getSubcategoriesByCategory = (catId) =>
  API.get(`/categories/${catId}/subcategories`);
export const createSubcategory = (data) => API.post("/subcategories", data);
export const updateSubcategory = (id, data) =>
  API.put(`/subcategories/${id}`, data);
export const deleteSubcategory = (id) => API.delete(`/subcategories/${id}`);

// ── Products ─────────────────────────────────────────────────
export const getProducts = () => API.get("/products");

export const createProduct = (data) =>
  API.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, data) => {
  data.append("_method", "PUT");
  return API.post(`/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = (id) => API.delete(`/products/${id}`);
