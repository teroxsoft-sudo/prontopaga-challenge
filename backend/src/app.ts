import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import scoreRoutes from "./routes/score.routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  }),
);

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ProntoPaga API",
  });
});

// API routes
app.use(authRoutes);
app.use(scoreRoutes);

// 404 - siempre debe quedar al final
app.use((_req, res) => {
  res.status(404).json({
    error: "Recurso no encontrado",
  });
});

export default app;