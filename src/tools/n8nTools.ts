import axios from "axios";

/**
 * Trigger an n8n workflow via webhook
 * Expected args:
 * {
 *   webhookPath: string,
 *   payload?: object
 * }
 */
export async function triggerN8nWorkflow(args: any) {
    try {
        const { webhookPath, payload } = args;

        if (!webhookPath) {
            throw new Error("webhookPath is required");
        }

        const baseUrl = process.env.N8N_BASE_URL;

        if (!baseUrl) {
            throw new Error("N8N_BASE_URL is not defined in environment variables");
        }

        const url = `${baseUrl}/webhook/${webhookPath}`;

        console.log("Triggering n8n webhook:", url);
        console.log("Payload:", payload);

        const response = await axios.post(url, payload || {});

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        console.error("Error triggering n8n workflow:", error.message);

        return {
            success: false,
            error: error.message,
        };
    }
}