import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // <-- replace with your backend URL
});

export default axiosInstance;
