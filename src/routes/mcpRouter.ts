import express from 'express';
import {
  trigger_n8n_workflow,
  send_data_to_n8n,
  fetch_response_from_n8n
} from '../tools/claudeTools.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { tool, params } = req.body;

  // Basic validation (because chaos is not a strategy)
  if (!tool) {
    return res.status(400).json({ error: 'Tool is required' });
  }

  try {
    let result;

    switch (tool) {
      case 'trigger_n8n_workflow':
        result = await trigger_n8n_workflow(params);
        break;

      case 'send_data_to_n8n':
        result = await send_data_to_n8n(params);
        break;

      case 'fetch_response_from_n8n':
        result = await fetch_response_from_n8n(params);
        break;

      default:
        return res.status(400).json({
          error: `Unknown tool: ${tool}`
        });
    }

    return res.json({
      success: true,
      tool,
      result
    });

  } catch (err: any) {
    console.error('MCP Tool Error:', err);

    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error'
    });
  }
});

export default router;