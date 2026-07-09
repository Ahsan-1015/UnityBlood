import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/",
});

let interceptorsAdded = false;

if (!interceptorsAdded) {
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      const status = error.response?.status;

      if (!error.response) {
        console.error("Axios network/CORS error:", error);
        return Promise.reject(error);
      }

      if (status === 401 || status === 403) {
        console.warn("Unauthorized request intercepted.");
      }
      return Promise.reject(error);
    },
  );

  interceptorsAdded = true;
}

export default function useAxiosSecure() {
  return axiosSecure;
}
