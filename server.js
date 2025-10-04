import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Shopify App Proxy Endpoint
app.get("/api/upload", (req, res) => {
  res.json({
    success: true,
    message: "GlowX File Uploader API is connected successfully!",
  });
});

// ✅ Root route (for testing directly)
app.get("/", (req, res) => {
  res.send("GlowX File Uploader is Live 🚀");
});

// Vercel export
export default app;
