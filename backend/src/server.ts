import http from "http";
import app from "./app";

http.createServer(app).listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
