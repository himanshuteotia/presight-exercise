import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import peopleRoutes from "./routes/people.routes";
import metaRoutes from "./routes/meta.routes";
import streamRoutes from "./routes/stream.routes";
import processRoutes from "./routes/process.routes";

const app = express();
app.use(cors());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60              // 60 requests per minute
});

app.use(limiter);
app.use(express.json());

app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
});

app.use("/api/people", peopleRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/process", processRoutes);

export default app;
