import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import {
  triggerN8nWorkflow,
  getAllWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  activateWorkflow,
  deactivateWorkflow,
  getAllExecutions,
  getExecution,
  deleteExecution,
} from "./tools/n8nTools.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 3000;

// =========================
// TOOL REGISTRY
// =========================

const tools = {
  trigger_n8n_workflow: { fn: triggerN8nWorkflow, schema: {} },

  get_all_workflows: { fn: getAllWorkflows, schema: {} },

  get_workflow: { fn: getWorkflow, schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  create_workflow: { fn: createWorkflow, schema: { type: "object", properties: { data: { type: "object" } }, required: ["data"] } },

  update_workflow: { fn: updateWorkflow, schema: { type: "object", properties: { id: { type: "string" }, data: { type: "object" } }, required: ["id", "data"] } },

  delete_workflow: { fn: deleteWorkflow, schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  activate_workflow: { fn: activateWorkflow, schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  deactivate_workflow: { fn: deactivateWorkflow, schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  get_all_executions: { fn: getAllExecutions, schema: {} },

  get_execution: { fn: getExecution, schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  delete_execution: { fn: deleteExecution, schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
};

// =========================
// MCP ENDPOINT
// =========================

app.post("/mcp", async (req, res) => {
  const { id, method, params } = req.body;

  try {
    if (method === "initialize") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: {
            name: "n8n-mcp-server",
            version: "2.0.0",
          },
        },
      });
    }

    if (method === "tools/list") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: Object.entries(tools).map(([name, tool]) => ({
            name,
            description: name,
            inputSchema: tool.schema,
          })),
        },
      });
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params;

      const tool = tools[name as keyof typeof tools];
      if (!tool) throw new Error(`Unknown tool: ${name}`);

      const result = await tool.fn(args || {});

      return res.json({
        jsonrpc: "2.0",
        id,
        result,
      });
    }

    return res.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: "Method not found" },
    });

  } catch (error: any) {
    console.error("MCP ERROR:", error);

    return res.json({
      jsonrpc: "2.0",
      id,
      error: {
        code: -32603,
        message: error?.message || String(error),
      },
    });
  }
});

// =========================
// ROUTES
// =========================

app.get("/", (req, res) => {
  res.send("MCP Server Running ✅");
});

app.get("/debug-check", (req, res) => {
  res.json({
    status: "OK",
    time: new Date().toISOString(),
  });
});

// =========================
// START
// =========================

app.listen(PORT, () => {
  console.log(`✅ MCP Server running on port ${PORT}`);
});