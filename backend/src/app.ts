import express from "express";
import cors from "cors";

import peopleRoutes from "./routes/people.routes";
import metaRoutes from "./routes/meta.routes";
import streamRoutes from "./routes/stream.routes";
import processRoutes from "./routes/process.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/people", peopleRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/process", processRoutes);

export default app;
