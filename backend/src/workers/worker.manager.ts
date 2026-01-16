import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const worker = new Worker(
  path.resolve(__dirname, "processor.worker.js")
);
