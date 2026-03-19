import dotenv from "dotenv";
dotenv.config();

export const N8N_BASE_URL =
    process.env.N8N_BASE_URL || "https://authentic-surprise-production.up.railway.app";

export const PORT = process.env.PORT || 3001;