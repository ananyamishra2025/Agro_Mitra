const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const buildUrl = (url) => `${API_BASE_URL}${url}`;

const getAuthToken = () => localStorage.getItem("agroMitraToken");

const buildHeaders = (headers = {}, isFormData = false) => {
  const token = getAuthToken();
  return {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.response = { data, status: response.status };
    throw error;
  }

  return { data };
};

const axiosInstance = {
  get: async (url) => {
    const response = await fetch(buildUrl(url), {
      headers: buildHeaders({}, true),
    });
    return parseResponse(response);
  },
  post: async (url, body, config = {}) => {
    const isFormData = body instanceof FormData;
    const headers = buildHeaders(config.headers || {}, isFormData);

    const response = await fetch(buildUrl(url), {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers,
    });

    return parseResponse(response);
  },
  put: async (url, body, config = {}) => {
    const response = await fetch(buildUrl(url), {
      method: "PUT",
      body: JSON.stringify(body),
      headers: buildHeaders(config.headers || {}),
    });

    return parseResponse(response);
  },

};

export default axiosInstance;
