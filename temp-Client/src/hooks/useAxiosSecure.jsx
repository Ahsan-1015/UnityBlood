import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/",
});
export default function useAxiosSecure() {
  // const navigate = useNavigate();
  // const { logOut } = useContext(AuthContext);

  // request interceptor to add authorization header for every secure call to the api
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  // intercepts 401 and 403 status

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
        // await logOut();
        // navigate("/registration");
      }
      return Promise.reject(error);
    },
  );

  return axiosSecure;
}
