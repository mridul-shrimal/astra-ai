const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(file) {
  const extension = file.originalname
    .split(".")
    .pop()
    .toLowerCase();

  switch (extension) {
    case "pdf": {
      const buffer = fs.readFileSync(file.path);
      const data = await pdfParse(buffer);
      return data.text;
    }

    case "txt": {
      return fs.readFileSync(file.path, "utf8");
    }

    case "docx": {
      const result = await mammoth.extractRawText({
        path: file.path,
      });

      return result.value;
    }

    case "csv": {
      return fs.readFileSync(file.path, "utf8");
    }

    // Images
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "bmp":
    case "svg": {
      return `[Image uploaded: ${file.originalname}]`;
    }

    default:
      return `[Unsupported file: ${file.originalname}]`;
  }
}

module.exports = extractText;