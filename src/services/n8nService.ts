import axios from "axios";
import { N8N_BASE_URL, N8N_API_KEY } from "../config/index.js";

function getHeaders() {
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (N8N_API_KEY) {
    headers["Authorization"] = `Bearer ${N8N_API_KEY}`;
  }

  return headers;
}

// 🔹 Trigger workflow
export async function triggerWorkflow(webhookPath: string, payload: any = {}) {
  const url = `${N8N_BASE_URL}/webhook/${webhookPath}`;
  const res = await axios.post(url, payload, { headers: getHeaders() });
  return res.data;
}

// 🔹 Send data
export async function sendData(endpoint: string, data: any) {
  const url = `${N8N_BASE_URL}/webhook/${endpoint}`;
  const res = await axios.post(url, data, { headers: getHeaders() });
  return res.data;
}

// 🔹 Fetch data
export async function fetchResponse(endpoint: string, query: any = {}) {
  const url = `${N8N_BASE_URL}/webhook/${endpoint}`;
  const res = await axios.get(url, {
    headers: getHeaders(),
    params: query,
  });
  return res.data;
}