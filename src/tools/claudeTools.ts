import {
  triggerWorkflow,
  sendData,
  fetchResponse
} from "../services/n8nService.js";

// Claude → MCP → n8n

export async function trigger_n8n_workflow(params: any) {
  return triggerWorkflow(params.webhookPath, params.payload || {});
}

export async function send_data_to_n8n(params: any) {
  return sendData(params.endpoint, params.data || {});
}

export async function fetch_response_from_n8n(params: any) {
  return fetchResponse(params.endpoint, params.query || {});
}