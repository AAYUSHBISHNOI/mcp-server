// import { triggerWorkflow } from "../services/n8nService.js";

// export async function trigger_n8n_workflow(params: any) {
//   try {
//     const { webhookPath } = params;

//     if (!webhookPath) {
//       throw new Error("webhookPath is required");
//     }

//     // 🔥 FIX: support both formats
//     const payload =
//       params.payload ||
//       {
//         message: params.message || "No message provided",
//       };

//     const result = await triggerWorkflow(webhookPath, payload);

//     return {
//       content: [
//         {
//           type: "text",
//           text:
//             typeof result === "string"
//               ? result
//               : JSON.stringify(result, null, 2),
//         },
//       ],
//     };

//   } catch (error: any) {
//     console.error("❌ Tool Error:", error.message);

//     return {
//       content: [
//         {
//           type: "text",
//           text: `Error calling n8n: ${error.message}`,
//         },
//       ],
//     };
//   }
// }