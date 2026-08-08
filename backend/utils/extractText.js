const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(file) {
  const extension = file.originalname
    .split(".")
    .pop()
    .toLowerCase();

  switch (extension) {
    case "pdf": {
      try {
        const buffer = fs.readFileSync(file.path);

        const parser = new PDFParse({
          data: new Uint8Array(buffer),
        });

        const result = await parser.getText();

        await parser.destroy();

        return result.text;
      } catch (err) {
        console.error("PDF Parse Error:", err);

        return "[Unable to read PDF]";
      }
    }

    case "txt": {
      return fs.readFileSync(file.path, "utf8");
    }

    case "docx": {
      try {
        const result = await mammoth.extractRawText({
          path: file.path,
        });

        return result.value;
      } catch (err) {
        console.error("DOCX Parse Error:", err);

        return "[Unable to read DOCX]";
      }
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