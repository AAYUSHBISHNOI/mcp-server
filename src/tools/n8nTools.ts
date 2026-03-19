import axios from "axios";

export async function triggerN8nWorkflow(args: any) {
    const { webhookUrl, data } = args;

    const response = await axios.post(webhookUrl, data);

    return response.data;
}

export async function sendDataToN8n(args: any) {
    const { webhookUrl, payload } = args;

    const response = await axios.post(webhookUrl, payload);

    return response.data;
}

export async function fetchResponseFromN8n(args: any) {
    const { url } = args;

    const response = await axios.get(url);

    return response.data;
}