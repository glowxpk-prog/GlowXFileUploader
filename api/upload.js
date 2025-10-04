export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Example: handle a test message
    return res.status(200).json({
      success: true,
      message: "GlowX File Uploader API is working correctly 🎉",
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
