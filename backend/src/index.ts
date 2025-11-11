import http from "http";
import { app } from "./app.js";
import { config } from "./config.js";
import { connectDB } from "./db.ts";

(async () => {
  await connectDB(config.mongoUri);
  const server = http.createServer(app);
  server.listen(config.port, () =>
    console.log(`✅ API http://localhost:${config.port}`)
  );
})();
