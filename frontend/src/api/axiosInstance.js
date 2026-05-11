const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const buildUrl = (url) => `${API_BASE_URL}${url}`;

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
    const response = await fetch(buildUrl(url));
    return parseResponse(response);
  },
  post: async (url, body, config = {}) => {
    const isFormData = body instanceof FormData;
    const headers = isFormData
      ? config.headers || {}
      : { "Content-Type": "application/json", ...(config.headers || {}) };

    const response = await fetch(buildUrl(url), {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers,
    });

    return parseResponse(response);
  },

};

export default axiosInstance;
