import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"; // ✅ needed to stream the buffer to Cloudinary

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Cloudinary config (uses your Vercel environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Use memory storage for temporary file buffers
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Wrap Cloudinary upload_stream in a Promise
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "glowx-uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await uploadToCloudinary();

    res.json({
      success: true,
      message: "File uploaded successfully!",
      fileUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("GlowX File Uploader is Live 💕 (Cloudinary connected!)");
});

export default app;
