import axios from "axios";

import { envConfig } from "./environment.config";

export const chatAxios = axios.create({
  baseURL: envConfig.APIBaseURL,
  timeout: 30 * 1000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
