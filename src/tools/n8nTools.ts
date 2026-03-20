import axios from "axios";

// =========================
// HELPERS
// =========================

function getBaseUrl() {
    const baseUrl = process.env.N8N_BASE_URL;
    if (!baseUrl) throw new Error("N8N_BASE_URL is not defined");
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
// RESPONSE FORMATTER
// =========================

function success(data: any) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}

function failure(err: any) {
    return {
        content: [
            {
                type: "text",
                text: `❌ Error: ${err.response?.data || err.message}`,
            },
        ],
    };
}

// =========================
// WORKFLOWS
// =========================

export async function getAllWorkflows() {
    try {
        const res = await getClient().get("/workflows");
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}

export async function getWorkflow({ id }: { id: string }) {
    try {
        const res = await getClient().get(`/workflows/${id}`);
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}

export async function createWorkflow({ data }: { data: any }) {
    try {
        const res = await getClient().post("/workflows", data);
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}

export async function updateWorkflow({ id, data }: any) {
    try {
        const res = await getClient().put(`/workflows/${id}`, data);
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}

export async function deleteWorkflow({ id }: { id: string }) {
    try {
        await getClient().delete(`/workflows/${id}`);
        return success({ deleted: true });
    } catch (err) {
        return failure(err);
    }
}

export async function activateWorkflow({ id }: { id: string }) {
    try {
        await getClient().patch(`/workflows/${id}/activate`);
        return success({ activated: true });
    } catch (err) {
        return failure(err);
    }
}

export async function deactivateWorkflow({ id }: { id: string }) {
    try {
        await getClient().patch(`/workflows/${id}/deactivate`);
        return success({ deactivated: true });
    } catch (err) {
        return failure(err);
    }
}

// =========================
// EXECUTIONS
// =========================

export async function getAllExecutions() {
    try {
        const res = await getClient().get("/executions");
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}

export async function getExecution({ id }: { id: string }) {
    try {
        const res = await getClient().get(`/executions/${id}`);
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}

export async function deleteExecution({ id }: { id: string }) {
    try {
        await getClient().delete(`/executions/${id}`);
        return success({ deleted: true });
    } catch (err) {
        return failure(err);
    }
}

// =========================
// WEBHOOK TRIGGER
// =========================

export async function triggerN8nWorkflow(args: any) {
    try {
        const { webhookPath, payload } = args;

        if (!webhookPath) throw new Error("webhookPath is required");

        const url = `${getBaseUrl()}/webhook/${webhookPath}`;

        const res = await axios.post(url, payload || {});

        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}