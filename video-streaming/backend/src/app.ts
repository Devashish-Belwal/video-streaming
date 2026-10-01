import express from "express";
import cors from "cors";
import videoRoutes from "./routes/video.routes.js";

const app = express();
app.use(express.json());
const frontendOrigin = process.env.FRONTEND_ORIGIN || (process.env.NODE_ENV === "production" ? false : "http://localhost:5173");
app.use(cors({
  origin: frontendOrigin || false,
  methods: ["GET", "POST", "PUT", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: false,
}));
app.use("/api/videos", videoRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
