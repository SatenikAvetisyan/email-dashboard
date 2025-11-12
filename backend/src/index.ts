import http from "http";
import { app } from "./app";
import { config } from "./config";
import { connectDB } from "./db";
import { connectIMAP } from "./services/imap.service";
import { Email } from "./models/Email";
import { createWSServer } from "./websocket";

(async () => {
  await connectDB(config.mongoUri);

  // Asegura que los índices (incluido el de texto) estén creados
  try {
    await Email.syncIndexes();
    console.log("✅ Email indexes synced");
  } catch (e) {
    console.error("⚠️ Could not sync indexes", e);
  }

  try {
    await connectIMAP();
  } catch (e) {
    console.error("⚠️ No se pudo conectar a IMAP. La API sigue viva.", e);
  }

  const server = http.createServer(app);
  createWSServer(server);
  
  server.listen(config.port, () =>
    console.log(`✅ API http://localhost:${config.port}`)
  );
})();
