import axios from "axios";

const API_URL = "http://localhost:3000/api";

async function request(path, method = "GET", body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await axios({
      url: `${API_URL}${path}`,
      method,
      headers,
      data: body,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Errore API");
  }
}

const api = {
  get: (path, auth = false) => request(path, "GET", null, auth),
  post: (path, body, auth = false) => request(path, "POST", body, auth),
  put: (path, body, auth = false) => request(path, "PUT", body, auth),
  patch: (path, body, auth = false) => request(path, "PATCH", body, auth),
  delete: (path, auth = false) => request(path, "DELETE", null, auth)
};

export default api;