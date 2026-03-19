import express from "express";
import dotenv from "dotenv";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

import {
  trigger_n8n_workflow,
  send_data_to_n8n,
  fetch_response_from_n8n
} from "./tools/claudeTools.js";

dotenv.config();

const app = express();
app.use(express.json());

const server = new Server({
  name: "n8n-mcp-server",
  version: "1.0.0"
});


// ✅ SINGLE HANDLER (NO setRequestHandler)
app.post("/mcp", async (req, res) => {
  try {
    const { method, params } = req.body;

    // =========================
    // INITIALIZE
    // =========================
    if (method === "initialize") {
      return res.json({
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "n8n-mcp-server",
          version: "1.0.0"
        }
      });
    }

    // =========================
    // LIST TOOLS
    // =========================
    if (method === "tools/list") {
      return res.json({
        tools: [
          {
            name: "trigger_n8n_workflow",
            description: "Trigger n8n workflow",
            inputSchema: {
              type: "object",
              properties: {
                webhookPath: { type: "string" },
                payload: { type: "object" }
              }
            }
          },
          {
            name: "send_data_to_n8n",
            description: "Send data to n8n",
            inputSchema: {
              type: "object",
              properties: {
                endpoint: { type: "string" },
                data: { type: "object" }
              }
            }
          },
          {
            name: "fetch_response_from_n8n",
            description: "Fetch response from n8n",
            inputSchema: {
              type: "object",
              properties: {
                endpoint: { type: "string" },
                query: { type: "object" }
              }
            }
          }
        ]
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
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      });
    }

    // =========================
    // UNKNOWN METHOD
    // =========================
    return res.status(400).json({
      error: `Unknown method: ${method}`
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});


// ✅ START SERVER
app.listen(3000, () => {
  console.log("✅ MCP Server running on port 3000");
});