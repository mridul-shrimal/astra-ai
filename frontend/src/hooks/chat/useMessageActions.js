import { useState } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

export default function useMessageActions(message) {
  const [showDownloadMenu, setShowDownloadMenu] =
    useState(false);

  const [copiedCode, setCopiedCode] =
    useState("");

  const [copiedMessage, setCopiedMessage] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  // =========================
  // Copy Code
  // =========================

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);

      toast.success("Code copied!");

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // =========================
  // Copy Message
  // =========================

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);

      toast.success("Copied to clipboard!");

      setCopiedMessage(true);

      setTimeout(() => {
        setCopiedMessage(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // =========================
  // Speech
  // =========================

  const speakMessage = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(message);

    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () =>
      setIsSpeaking(true);

    utterance.onend = () =>
      setIsSpeaking(false);

    utterance.onerror = () =>
      setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  // =========================
  // Download
  // =========================

  const downloadResponse = (format = "txt") => {
    if (format === "txt") {
      const blob = new Blob([message], {
        type: "text/plain;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = `Astra_Response_${Date.now()}.txt`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      return;
    }

    if (format === "pdf") {
      const pdf = new jsPDF();

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      const lines = pdf.splitTextToSize(
        message,
        180
      );

      pdf.text(lines, 15, 20);

      pdf.save(
        `Astra_Response_${Date.now()}.pdf`
      );

      return;
    }

    if (format === "html") {
      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Astra AI Response</title>
<style>
body{
font-family:Arial,sans-serif;
padding:30px;
line-height:1.6;
}
pre{
white-space:pre-wrap;
word-break:break-word;
}
</style>
</head>
<body>
<pre>${message}</pre>
</body>
</html>`;

      const blob = new Blob([html], {
        type: "text/html",
      });

      const url = URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = `Astra_Response_${Date.now()}.html`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      return;
    }

    if (format === "md") {
      const blob = new Blob([message], {
        type: "text/markdown;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = `Astra_Response_${Date.now()}.md`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      return;
    }

    if (format === "json") {
      const data = {
        sender: "Astra AI",
        message,
        exportedAt:
          new Date().toISOString(),
      };

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        {
          type: "application/json",
        }
      );

      const url = URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = `Astra_Response_${Date.now()}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }
  };

  return {
    showDownloadMenu,
    setShowDownloadMenu,
    copiedCode,
    copiedMessage,
    isSpeaking,
    copyCode,
    copyMessage,
    speakMessage,
    downloadResponse,
  };
}