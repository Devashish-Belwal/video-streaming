import express from "express";
import cors from "cors";
import videoRoutes from "./routes/video.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/videos", videoRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
