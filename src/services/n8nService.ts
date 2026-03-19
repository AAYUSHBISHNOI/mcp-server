import axios from "axios";
import { N8N_BASE_URL, N8N_API_KEY } from "../config/index.js";

export async function triggerWorkflow(webhookPath: string, payload: any = {}) {
  const url = `${N8N_BASE_URL}/webhook/${webhookPath}`;

  console.log("🚀 Trigger URL:", url);

  const headers: any = {
    "Content-Type": "application/json",
  };

  if (N8N_API_KEY) {
    headers["Authorization"] = `Bearer ${N8N_API_KEY}`;
  }

  const response = await axios.post(url, payload, { headers });
  return response.data;
}

export async function sendData(endpoint: string, data: any) {
  const url = `${N8N_BASE_URL}/webhook/${endpoint}`;

  console.log("📤 Send URL:", url);

  const headers: any = {
    "Content-Type": "application/json",
  };

  if (N8N_API_KEY) {
    headers["Authorization"] = `Bearer ${N8N_API_KEY}`;
  }

  const response = await axios.post(url, data, { headers });
  return response.data;
}

export async function fetchResponse(endpoint: string, query: any = {}) {
  const url = `${N8N_BASE_URL}/webhook/${endpoint}`;

  console.log("📥 Fetch URL:", url);

  const headers: any = {};

  if (N8N_API_KEY) {
    headers["Authorization"] = `Bearer ${N8N_API_KEY}`;
  }

  const response = await axios.get(url, {
    headers,
    params: query,
  });

  return response.data;
}