import http from "http";
import { app } from "./app.js";
import { config } from "./config.js";
import { connectDB } from "./db.js";
import { connectIMAP } from "./services/imap.service.js";

(async () => {
  await connectDB(config.mongoUri);

  // Inicia IMAP al arrancar el servidor
  await connectIMAP();

  const server = http.createServer(app);
  server.listen(config.port, () =>
    console.log(`✅ API http://localhost:${config.port}`)
  );
})();
