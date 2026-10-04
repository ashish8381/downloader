const functions = require("firebase-functions");
const instagramGetUrl = require("instagram-url-direct");
const cors = require("cors")({ origin: true });

exports.igDownloader = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const url = req.query.url || req.body.url;
      if (!url) {
        return res.status(400).json({ error: "No URL provided" });
      }

      // Try fetching using instagram-url-direct
      const result = await instagramGetUrl(url);
      
      if (result && result.url_list && result.url_list.length > 0) {
        return res.status(200).json({ 
          success: true, 
          media: result.url_list 
        });
      } else {
        return res.status(404).json({ error: "Media not found or account is private." });
      }
    } catch (error) {
      console.error("IG Error:", error);
      return res.status(500).json({ error: "Failed to extract Instagram media." });
    }
  });
});
