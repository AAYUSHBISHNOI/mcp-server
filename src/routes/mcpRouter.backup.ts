// import { triggerWorkflow } from "../services/n8nService.js";



// export async function trigger_n8n_workflow(params: any) {
//   try {
//     const { webhookPath, payload } = params;

//     if (!webhookPath) {
//       throw new Error("webhookPath is required");
//     }

//     const result = await triggerWorkflow(webhookPath, payload || {});

//     return {
//       success: true,
//       data: result,
//     };
//   } catch (error: any) {
//     console.error("MCP Router Error:", error.message);

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// }