import { parentPort } from "worker_threads";

if (!parentPort) {
  throw new Error("Worker must have parentPort");
}

parentPort.on("message", (id) => {
  setTimeout(() => {
    parentPort.postMessage({
      id,
      result: `Processed result for request ${id}`,
    });
  }, 2000);
});
