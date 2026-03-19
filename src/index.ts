import express from "express";
import dotenv from "dotenv";

import {
  trigger_n8n_workflow,
  send_data_to_n8n,
  fetch_response_from_n8n
} from "./tools/claudeTools.js";

import { PORT } from "./config/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// =========================
// MCP ENDPOINT
// =========================
app.post("/mcp", async (req, res) => {
  const { id, method, params } = req.body;

  try {
    // =========================
    // INITIALIZE
    // =========================
    if (method === "initialize") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "n8n-mcp-server",
            version: "1.0.0"
          }
        }
      });
    }

    // =========================
    // LIST TOOLS
    // =========================
    if (method === "tools/list") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "trigger_n8n_workflow",
              description: "Trigger n8n workflow",
              inputSchema: {
                type: "object",
                properties: {
                  webhookPath: { type: "string" },
                  payload: { type: "object" }
                },
                required: ["webhookPath"]
              }
            },
            {
              name: "send_data_to_n8n",
              description: "Send data to n8n webhook",
              inputSchema: {
                type: "object",
                properties: {
                  endpoint: { type: "string" },
                  data: { type: "object" }
                },
                required: ["endpoint"]
              }
            },
            {
              name: "fetch_response_from_n8n",
              description: "Fetch data from n8n webhook",
              inputSchema: {
                type: "object",
                properties: {
                  endpoint: { type: "string" },
                  query: { type: "object" }
                },
                required: ["endpoint"]
              }
            }
          ]
        }
      });
    }

    // =========================
    // CALL TOOL
    // =========================
    if (method === "tools/call") {
      const { name, arguments: args } = params;

      let result;

      switch (name) {
        case "trigger_n8n_workflow":
          result = await trigger_n8n_workflow(args);
          break;

        case "send_data_to_n8n":
          result = await send_data_to_n8n(args);
          break;

        case "fetch_response_from_n8n":
          result = await fetch_response_from_n8n(args);
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(result)
            }
          ]
        }
      });
    }

    // =========================
    // UNKNOWN METHOD
    // =========================
    return res.json({
      jsonrpc: "2.0",
      id,
      error: {
        code: -32601,
        message: "Method not found"
      }
    });

  } catch (error: any) {
    return res.json({
      jsonrpc: "2.0",
      id,
      error: {
        code: -32603,
        message: error.message
      }
    });
  }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`✅ MCP Server running on port ${PORT}`);
});