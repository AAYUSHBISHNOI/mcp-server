import express from "express";
import dotenv from "dotenv";

import { trigger_n8n_workflow } from "./tools/claudeTools.js";
import { PORT } from "./config/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Define a flexible type for n8n response
type N8nResult = {
  reply?: string;
  content?: { type: string; text: string }[];
  [key: string]: any;
};

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
              description: "Send data to n8n and get response back",
              inputSchema: {
                type: "object",
                properties: {
                  webhookPath: { type: "string" },
                  payload: { type: "object" }
                },
                required: ["webhookPath"]
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

      let result: N8nResult;

      if (name === "trigger_n8n_workflow") {
        result = await trigger_n8n_workflow(args);
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }

      // ✅ Safely handle all response formats
      const responseText =
        result?.reply ??
        result?.content?.[0]?.text ??
        JSON.stringify(result);

      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: responseText
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