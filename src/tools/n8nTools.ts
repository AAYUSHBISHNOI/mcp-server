import axios from "axios";

// =========================
// HELPERS (SAFE ENV ACCESS)
// =========================

function getBaseUrl() {
    const baseUrl = process.env.N8N_BASE_URL;
    if (!baseUrl) {
        throw new Error("N8N_BASE_URL is not defined");
    }
    return baseUrl;
}

function getClient() {
    const baseUrl = getBaseUrl();
    const apiKey = process.env.N8N_API_KEY;

    return axios.create({
        baseURL: `${baseUrl}/api/v1`,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "X-N8N-API-KEY": apiKey || "",
        },
    });
}

// =========================
// WORKFLOW MANAGEMENT
// =========================

export async function getAllWorkflows() {
    try {
        const client = getClient();
        const res = await client.get("/workflows");
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

export async function getWorkflow({ id }: { id: string }) {
    try {
        const client = getClient();
        const res = await client.get(`/workflows/${id}`);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

export async function createWorkflow({ data }: { data: any }) {
    try {
        const client = getClient();
        const res = await client.post("/workflows", data);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

export async function updateWorkflow({
    id,
    data,
}: {
    id: string;
    data: any;
}) {
    try {
        const client = getClient();
        const res = await client.put(`/workflows/${id}`, data);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

export async function deleteWorkflow({ id }: { id: string }) {
    try {
        const client = getClient();
        await client.delete(`/workflows/${id}`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

export async function activateWorkflow({ id }: { id: string }) {
    try {
        const client = getClient();
        await client.patch(`/workflows/${id}/activate`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

export async function deactivateWorkflow({ id }: { id: string }) {
    try {
        const client = getClient();
        await client.patch(`/workflows/${id}/deactivate`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

// =========================
// EXECUTION MANAGEMENT
// =========================

export async function getAllExecutions() {
    try {
        const client = getClient();
        const res = await client.get("/executions");
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

export async function getExecution({ id }: { id: string }) {
    try {
        const client = getClient();
        const res = await client.get(`/executions/${id}`);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

export async function deleteExecution({ id }: { id: string }) {
    try {
        const client = getClient();
        await client.delete(`/executions/${id}`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.response?.data || err.message };
    }
}

// =========================
// WEBHOOK TRIGGER
// =========================

export async function triggerN8nWorkflow(args: any) {
    try {
        const { webhookPath, payload } = args;

        if (!webhookPath) {
            throw new Error("webhookPath is required");
        }

        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/webhook/${webhookPath}`;

        console.log("Triggering webhook:", url);

        const res = await axios.post(url, payload || {});

        return {
            success: true,
            data: res.data,
        };
    } catch (err: any) {
        return {
            success: false,
            error: err.response?.data || err.message,
        };
    }
}