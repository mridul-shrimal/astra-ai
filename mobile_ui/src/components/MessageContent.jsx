import { Text, View } from "react-native";

import { useTheme } from "../theme/ThemeProvider";

const BOLD_RE = /\*\*(.+?)\*\*/g;
const ITALIC_RE = /\*(.+?)\*/g;
const INLINE_CODE_RE = /`([^`]+)`/g;
const HEADING_RE = /^(#{1,6})\s+(.+)$/gm;
const LIST_ITEM_RE = /^[-*]\s+(.+)$/gm;
const CODE_BLOCK_RE = /```[\s\S]*?```/g;

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function unescapeMarkers(str) {
  return str
    .replace(/\\(\*|_|`{1,3})/g, "$1");
}

function parseMarkdown(content) {
  const lines = content.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    const codeMatch = line.match(/^```(\w*)$/);
    if (codeMatch) {
      const lang = codeMatch[1] || "text";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].match(/^```/)) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", lang, content: codeLines.join("\n") });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push({ type: "heading", level, content: headingMatch[2] });
      i++;
      continue;
    }

    // List items
    if (line.match(/^[-*]\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        const itemContent = lines[i].replace(/^[-*]\s+/, "");
        items.push(itemContent);
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].match(/^(#{1,6})\s+/) && !lines[i].match(/^[-*]\s+/) && !lines[i].match(/^```/)) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", content: paraLines.join(" ") });
  }

  return blocks;
}

function renderInline(content, { colors, typography }) {
  const parts = [];

  // Split by inline code first, then bold, then italic
  const segments = content.split(INLINE_CODE_RE);

  segments.forEach((seg, idx) => {
    if (idx % 2 === 1) {
      // inline code
      parts.push({ type: "code", text: seg });
    } else if (seg) {
      // Process bold and italic in non-code text
      const boldParts = seg.split(BOLD_RE);
      boldParts.forEach((bp, bIdx) => {
        if (bIdx % 2 === 1) {
          parts.push({ type: "bold", text: bp });
        } else {
          // Process italic within non-bold text
          const italicParts = bp.split(ITALIC_RE);
          italicParts.forEach((ip, iIdx) => {
            if (iIdx % 2 === 1) {
              parts.push({ type: "italic", text: ip });
            } else if (ip) {
              parts.push({ type: "text", text: ip });
            }
          });
        }
      });
    }
  });

  return parts;
}

function InlineContent({ parts, colors, typography }) {
  return parts.map((part, idx) => {
    if (part.type === "code") {
      return (
        <Text
          key={idx}
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            backgroundColor: colors.surfaceDim,
            color: colors.primary,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
          }}
        >
          {part.text}
        </Text>
      );
    }
    if (part.type === "bold") {
      return (
        <Text key={idx} style={{ fontWeight: "700", color: colors.text }}>
          {part.text}
        </Text>
      );
    }
    if (part.type === "italic") {
      return (
        <Text key={idx} style={{ fontStyle: "italic", color: colors.text }}>
          {part.text}
        </Text>
      );
    }
    return (
      <Text key={idx} style={{ color: colors.text }}>
        {part.text}
      </Text>
    );
  });
}

export default function MessageContent({ content }) {
  const { colors, typography } = useTheme();
  const blocks = parseMarkdown(content || "");

  if (!content || blocks.length === 0) {
    return null;
  }

  return (
    <View>
      {blocks.map((block, idx) => {
        const key = `${block.type}-${idx}`;

        if (block.type === "code") {
          return (
            <View
              key={key}
              style={{
                backgroundColor: colors.surfaceDim,
                borderRadius: 8,
                padding: 12,
                marginVertical: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: colors.textMuted,
                }}
              >
                {block.content}
              </Text>
            </View>
          );
        }

        if (block.type === "heading") {
          const headingStyle =
            block.level === 1
              ? typography.display
              : block.level === 2
                ? typography.title
                : { fontSize: 16, fontWeight: "600" };

          return (
            <Text
              key={key}
              style={[
                headingStyle,
                {
                  color: colors.text,
                  marginTop: idx > 0 ? 12 : 0,
                  marginBottom: 8,
                },
              ]}
            >
              {block.content}
            </Text>
          );
        }

        if (block.type === "list") {
          return (
            <View key={key} style={{ marginVertical: 6 }}>
              {block.items.map((item, itemIdx) => {
                const parts = renderInline(item, { colors, typography });
                return (
                  <View
                    key={itemIdx}
                    style={{ flexDirection: "row", marginLeft: 4, marginBottom: 2 }}
                  >
                    <Text style={{ color: colors.textMuted, marginRight: 6 }}>
                      •
                    </Text>
                    <Text style={{ color: colors.text, flexShrink: 1 }}>
                      <InlineContent parts={parts} colors={colors} typography={typography} />
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        }

        // paragraph
        const parts = renderInline(block.content, { colors, typography });
        return (
          <Text
            key={key}
            style={[
              typography.body,
              {
                color: colors.text,
                lineHeight: 22,
                marginTop: idx > 0 ? 8 : 0,
              },
            ]}
          >
            <InlineContent parts={parts} colors={colors} typography={typography} />
          </Text>
        );
      })}
    </View>
  );
}
