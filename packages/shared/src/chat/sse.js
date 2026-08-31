/**
 * Parses completed SSE event frames without making transport assumptions.
 *
 * Callers are responsible for buffering streamed data into complete frames.
 */
export function parseSseEvents(
  events,
  { onEvent, onParseError } = {}
) {
  for (const event of events) {
    const line = event
      .split("\n")
      .find((line) =>
        line.startsWith("data:")
      );

    if (!line) {
      continue;
    }

    const data = line
      .replace(/^data:\s*/, "")
      .trim();

    if (!data || data === "[DONE]") {
      continue;
    }

    try {
      onEvent?.(JSON.parse(data));
    } catch (error) {
      onParseError?.(error);
    }
  }
}
