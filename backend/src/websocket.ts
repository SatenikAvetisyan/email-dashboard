import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { config } from "./config.js";

type UserId = string;
type Client = WebSocket;

const userSockets = new Map<UserId, Set<Client>>();

function addClient(userId: UserId, ws: Client) {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId)!.add(ws);
}

function removeClient(userId: UserId, ws: Client) {
  const set = userSockets.get(userId);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) userSockets.delete(userId);
}

export function broadcastToUser(userId: UserId, event: any) {
  const set = userSockets.get(userId);
  if (!set || set.size === 0) return;
  const payload = JSON.stringify(event);
  for (const ws of set) {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  }
}

export function createWSServer(server: any) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    try {
      const url = new URL(req.url || "", "http://localhost");
      const token = url.searchParams.get("token");
      if (!token) {
        ws.close(4401, "Missing token");
        return;
      }
      const payload = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
      const userId = payload.id;
      addClient(userId, ws);

      ws.send(JSON.stringify({ type: "hello", payload: { userId, ts: Date.now() } }));

      ws.on("close", () => removeClient(userId, ws));
      ws.on("error", () => removeClient(userId, ws));
      // Si quisieras pings/keepalive, puedes añadir intervalos aquí.
    } catch {
      ws.close(4401, "Invalid token");
    }
  });

  return wss;
}