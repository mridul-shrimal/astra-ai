const express = require("express");
const router = express.Router();
const extractText = require("../utils/extractText");
const upload = require("../middleware/uploadMiddleware");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const text = await extractText(req.file);

    res.json({
      success: true,
      message: "File uploaded successfully",

      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },

      extractedText: text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;