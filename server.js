import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure Cloudinary using environment variables from Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Memory storage for temporary files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload route for Shopify App Proxy
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload directly from buffer
    const uploaded = await cloudinary.uploader.upload_stream(
      { folder: "glowx-uploads" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return res.status(500).json({ success: false, message: "Upload failed" });
        }
        return res.json({
          success: true,
          message: "File uploaded successfully!",
          fileUrl: result.secure_url,
        });
      }
    );

    uploaded.end(req.file.buffer);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("GlowX File Uploader is Live 💕 (Cloudinary connected!)");
});

export default app;

