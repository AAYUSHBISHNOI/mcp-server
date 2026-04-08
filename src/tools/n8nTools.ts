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
        timeout: 15000,
        headers: {
            "Content-Type": "application/json",
            "X-N8N-API-KEY": apiKey || "",
        },
    });
}

// =========================
// RESPONSE HELPERS
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
                text: JSON.stringify(
                    {
                        message: err?.message,
                        status: err?.response?.status,
                        data: err?.response?.data,
                    },
                    null,
                    2
                ),
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

export async function getWorkflow({ id }: any) {
    try {
        const res = await getClient().get(`/workflows/${id}`);
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}

export async function createWorkflow({ data }: any) {
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

export async function deleteWorkflow({ id }: any) {
    try {
        await getClient().delete(`/workflows/${id}`);
        return success({ deleted: true });
    } catch (err) {
        return failure(err);
    }
}

export async function activateWorkflow({ id }: any) {
    try {
        await getClient().patch(`/workflows/${id}/activate`);
        return success({ activated: true });
    } catch (err) {
        return failure(err);
    }
}

export async function deactivateWorkflow({ id }: any) {
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

export async function getExecution({ id }: any) {
    try {
        const res = await getClient().get(`/executions/${id}`);
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}

export async function deleteExecution({ id }: any) {
    try {
        await getClient().delete(`/executions/${id}`);
        return success({ deleted: true });
    } catch (err) {
        return failure(err);
    }
}

// =========================
// WEBHOOK
// =========================

export async function triggerN8nWorkflow({ webhookPath, payload }: any) {
    try {
        const url = `${getBaseUrl()}/webhook/${webhookPath}`;
        const res = await axios.post(url, payload || {});
        return success(res.data);
    } catch (err) {
        return failure(err);
    }
}