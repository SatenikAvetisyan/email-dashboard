import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 4000),
  env: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "change_me",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/email_dashboard",
  imap: {
    host: process.env.IMAP_HOST || "",
    port: Number(process.env.IMAP_PORT || 993),
    secure: process.env.IMAP_SECURE === "true",
    user: process.env.IMAP_USER || "",
    pass: process.env.IMAP_PASS || ""
  }
};
