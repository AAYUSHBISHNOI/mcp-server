import dotenv from "dotenv";

dotenv.config();

export const N8N_BASE_URL =
    process.env.N8N_BASE_URL || "https://authentic-surprise-production.up.railway.app/webhook";

export const N8N_API_KEY = process.env.N8N_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNjM1OTI3ZS03M2JkLTQwNzYtYTg0Mi00ZWE1MmE0OGYxMzAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNDdjY2UxNjQtMmM3Mi00YTE4LWIyNGQtOTQwYjUyYTQ0ZGI2IiwiaWF0IjoxNzczOTAxOTgzLCJleHAiOjE3NzY0NTA2MDB9.eeXjEpAZuQ9duWwd8Zh-DI-HHMX-xXfgEGnMQbbeXDs";

export const PORT = process.env.PORT || 3000;