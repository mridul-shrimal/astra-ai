const axios = require("axios");
const FormData = require("form-data");

async function testStream() {
  try {
    const form = new FormData();

    form.append(
      "message",
      "Explain Astra AI in exactly 3 short sentences."
    );

    form.append("sessionId", "");

    form.append(
      "model",
      "mistralai/mistral-small-3.2-24b-instruct"
    );

    form.append("temperature", "0.7");
    form.append("useMemory", "false");
    form.append("autoSaveMemory", "false");

    const response = await axios.post(
      "http://localhost:5000/api/chat/stream",
      form,
      {
        responseType: "stream",
        headers: {
          ...form.getHeaders(),
          Accept: "text/event-stream",
        },
      }
    );

    console.log("\n--- STREAM START ---\n");

    response.data.on("data", (chunk) => {
      process.stdout.write(
        chunk.toString()
      );
    });

    response.data.on("end", () => {
      console.log(
        "\n\n--- STREAM END ---"
      );
    });

    response.data.on("error", (error) => {
      console.error(
        "\nStream error:",
        error
      );
    });
  } catch (error) {
    console.error(
      "\nRequest failed:"
    );

    if (error.response?.data) {
      error.response.data.on("data", (chunk) => {
        process.stdout.write(
          chunk.toString()
        );
      });
    } else {
      console.error(error.message);
    }
  }
}

testStream();