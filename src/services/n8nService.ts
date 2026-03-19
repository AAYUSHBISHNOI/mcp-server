import axios from "axios";
import { N8N_BASE_URL } from "../config/index.js";

/**
 * Call n8n webhook
 */
export async function triggerWorkflow(webhookPath: string, payload: any = {}) {
  if (!webhookPath) {
    throw new Error("webhookPath is required");
  }

  const url = `${N8N_BASE_URL}/webhook/${webhookPath}`;

  console.log("🚀 Calling n8n:", url);
  console.log("📦 Payload:", payload);

  const response = await axios.post(url, payload);

  console.log("✅ n8n Response:", response.data);

  return response.data;
}