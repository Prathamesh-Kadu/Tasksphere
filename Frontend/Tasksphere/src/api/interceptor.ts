import { getToken, removeToken } from "../utils/tokenStorage"

import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {

    const status = error.response?.status
    const message = error.response?.data?.message || "Something went wrong"

    if (status === 401) {
      removeToken()
      window.location.href = "/login"
    }

    return Promise.reject({
      status,
      message
    })
  }
)

export default axiosClient