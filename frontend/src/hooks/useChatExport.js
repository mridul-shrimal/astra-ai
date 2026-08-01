 import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

function useExportChat({
  currentChat,
  selectedFormat,
  setExportOpen,
}) {
 // =========================
  // Export Functions
  // =========================

  const handleExportChat = () => {
    setExportOpen(false);

    if (!currentChat) return;

    const messages = currentChat.messages;

    const plainText = messages
      .map((msg) => {
        const sender =
          msg.sender === "user" ? "You" : "Astra";

        return `${sender}\n\n${msg.message}`;
      })
      .join(
        "\n\n----------------------------------------\n\n"
      );

    const markdown = messages
      .map((msg) => {
        const sender =
          msg.sender === "user"
            ? "## You"
            : "## Astra";

        return `${sender}\n\n${msg.message}`;
      })
      .join("\n\n---\n\n");

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${currentChat.title}</title>

<style>
body{
font-family:Arial,sans-serif;
background:#0f172a;
color:white;
padding:40px;
line-height:1.7;
}

.message{
margin-bottom:30px;
padding:20px;
border-radius:12px;
background:#1e293b;
}

.user{
border-left:5px solid #06b6d4;
}

.ai{
border-left:5px solid #8b5cf6;
}

h2{
margin-top:0;
}
</style>

</head>

<body>

<h1>${currentChat.title}</h1>

${messages
  .map(
    (msg) => `
<div class="message ${msg.sender}">
<h2>${msg.sender === "user" ? "You" : "Astra"}</h2>
<p>${msg.message.replace(/\n/g, "<br>")}</p>
</div>
`
  )
  .join("")}

</body>
</html>
`;

    const json = JSON.stringify(messages, null, 2);

    const downloadFile = (
      content,
      filename,
      type
    ) => {
      const blob = new Blob([content], { type });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    };

    // PDF
    if (selectedFormat === "pdf") {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();
      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 15;
      const lineHeight = 7;

      let y = 20;
      let page = 1;

        // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Astra AI Conversation", margin, y);

      y += 12;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      const lines = pdf.splitTextToSize(
        plainText,
        pageWidth - margin * 2
      );

      lines.forEach((line) => {
        // Create a new page if required
        if (y > pageHeight - 20) {
          pdf.setFontSize(10);
          pdf.text(
            `Page ${page}`,
            pageWidth - 30,
            pageHeight - 8
          );

          pdf.addPage();

          page++;
          y = 20;

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);
        }

        pdf.text(line, margin, y);
        y += lineHeight;
      });

      // Last page number
      pdf.setFontSize(10);
      pdf.text(
        `Page ${page}`,
        pageWidth - 30,
        pageHeight - 8
      );

      pdf.save(
        `${currentChat.title || "chat"} - Astra AI.pdf`
      );

      toast.success("Chat exported as PDF!");
      return;
    }

    // =========================
    // Export Formats
    // =========================

    // TXT
    if (selectedFormat === "txt") {
      downloadFile(
        plainText,
        `${currentChat.title || "chat"}.txt`,
        "text/plain;charset=utf-8"
      );

      toast.success("Chat exported as TXT!");
      return;
    }

    // Markdown
    if (selectedFormat === "md") {
      downloadFile(
        markdown,
        `${currentChat.title || "chat"}.md`,
        "text/markdown;charset=utf-8"
      );

      toast.success("Chat exported as Markdown!");
      return;
    }

    // HTML
    if (selectedFormat === "html") {
      downloadFile(
        html,
        `${currentChat.title || "chat"}.html`,
        "text/html;charset=utf-8"
      );

      toast.success("Chat exported as HTML!");
      return;
    }

    // JSON
    if (selectedFormat === "json") {
      downloadFile(
        json,
        `${currentChat.title || "chat"}.json`,
        "application/json"
      );

      toast.success("Chat exported as JSON!");
      return;
    }

    toast(
      `${selectedFormat.toUpperCase()} export coming next.`
    );
  };
    return {
    handleExportChat,
  };
}

export default useExportChat;