import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use memory storage (no disk save)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload route (called by Shopify App Proxy)
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Step 1: create a fake URL (you can later upload to Cloudinary / Shopify Files)
    const fileUrl = `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(req.file.originalname)}`;

    // Step 2: return to frontend
    return res.json({
      success: true,
      message: "File uploaded successfully!",
      fileUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("GlowX File Uploader is Live 💕");
});

export default app;
