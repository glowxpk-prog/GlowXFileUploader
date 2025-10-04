import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// ✅ Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure Cloudinary using Vercel Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Use multer for in-memory uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload route
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER || "glowx/uploads" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }

        // ✅ Success response
        return res.json({
          success: true,
          message: "File uploaded successfully!",
          fileUrl: result.secure_url,
        });
      }
    );

    // Write buffer to stream
    const stream = result;
    stream.end(req.file.buffer);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✨ GlowX Cloudinary File Uploader is Live 💕");
});

// ✅ Export for Vercel
export default app;
