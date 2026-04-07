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
app.use(cors({ origin: "*" })); // ✅ IMPORTANT for Claude

const PORT = process.env.PORT || 3000;

// =========================
// TOOL REGISTRY
// =========================

const tools = {
  trigger_n8n_workflow: {
    fn: triggerN8nWorkflow,
    schema: {
      type: "object",
      properties: {
        webhookPath: { type: "string" },
        payload: { type: "object" },
      },
      required: ["webhookPath"],
    },
  },

  get_all_workflows: {
    fn: getAllWorkflows,
    schema: { type: "object", properties: {} },
  },

  get_workflow: {
    fn: getWorkflow,
    schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },

  create_workflow: {
    fn: createWorkflow,
    schema: {
      type: "object",
      properties: { data: { type: "object" } },
      required: ["data"],
    },
  },

  update_workflow: {
    fn: updateWorkflow,
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        data: { type: "object" },
      },
      required: ["id", "data"],
    },
  },

  delete_workflow: {
    fn: deleteWorkflow,
    schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },

  activate_workflow: {
    fn: activateWorkflow,
    schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },

  deactivate_workflow: {
    fn: deactivateWorkflow,
    schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },

  get_all_executions: {
    fn: getAllExecutions,
    schema: { type: "object", properties: {} },
  },

  get_execution: {
    fn: getExecution,
    schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },

  delete_execution: {
    fn: deleteExecution,
    schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
};

// =========================
// MCP JSON-RPC ENDPOINT (KEEP THIS)
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
            description: name.replace(/_/g, " "),
            inputSchema: tool.schema,
          })),
        },
      });
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params;

      const tool = tools[name];
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

  } catch (error) {
    return res.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: error.message },
    });
  }
});

// =========================
// ✅ ADD THESE (CRITICAL FOR CLAUDE)
// =========================

// 👉 List tools (Claude uses this)
app.get("/tools", (req, res) => {
  res.json({
    tools: Object.entries(tools).map(([name, tool]) => ({
      name,
      description: name.replace(/_/g, " "),
      input_schema: tool.schema,
    })),
  });
});

// 👉 Invoke tool (Claude uses this)
app.post("/invoke", async (req, res) => {
  const { tool, input } = req.body;

  try {
    const selectedTool = tools[tool];

    if (!selectedTool) {
      return res.status(400).json({ error: "Tool not found" });
    }

    const result = await selectedTool.fn(input || {});
    res.json({ output: result });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// OPTIONAL ROOT (for testing)
// =========================

app.get("/", (req, res) => {
  res.send("MCP Server Running ✅");
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`✅ MCP Server running on port ${PORT}`);
});