export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false, keepExtensions: true });
  form.uploadDir = path.join(process.cwd(), "/tmp");

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Error while uploading." });
    }

    const file = files.file[0];
    const fileName = file.originalFilename;
    const tempPath = file.filepath;

    // In production, you'd upload to a bucket (e.g., Cloudflare R2, Supabase, etc.)
    // For testing, just respond with the filename
    return res.status(200).json({
      success: true,
      fileName,
      message: "File received successfully!",
    });
  });
}
