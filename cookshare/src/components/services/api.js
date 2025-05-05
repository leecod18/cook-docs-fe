import axios from "axios"

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
})