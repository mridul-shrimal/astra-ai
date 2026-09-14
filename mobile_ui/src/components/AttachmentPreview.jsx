import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeProvider";

const FILE_ICONS = {
  pdf: "document-text-outline",
  doc: "document-outline",
  docx: "document-outline",
  txt: "document-outline",
  csv: "document-text-outline",
  xlsx: "document-text-outline",
  xls: "document-text-outline",
  png: "image-outline",
  jpg: "image-outline",
  jpeg: "image-outline",
  gif: "image-outline",
  default: "document-outline",
};

const getExtension = (filename) => {
  if (!filename) return "";
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

const getFileIcon = (ext) => FILE_ICONS[ext] || FILE_ICONS.default;

const isImage = (ext) => ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);

const truncateFilename = (filename, maxLength = 24) => {
  if (!filename) return "attachment";
  if (filename.length <= maxLength) return filename;
  const ext = getExtension(filename);
  const name = filename.slice(0, filename.lastIndexOf("."));
  const truncated = name.slice(0, maxLength - ext.length - 3);
  return truncated + "..." + (ext ? "." + ext : "");
};

export default function AttachmentPreview({ attachment, onRemove }) {
  const { colors, typography, radius, spacing } = useTheme();
  const ext = getExtension(attachment?.name || "");
  const fileName = attachment?.name || "attachment";
  const fileSize = attachment?.size;

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImageFile = isImage(ext);
  const iconName = getFileIcon(ext);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceDim,
          borderColor: colors.borderDim,
          borderRadius: radius.md,
        },
      ]}
    >
      {attachment?.uri ? (
        isImageFile ? (
          <Image source={{ uri: attachment.uri }} style={styles.imagePreview} />
        ) : (
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.surfaceDim },
            ]}
          >
            <Ionicons name={iconName} size={32} color={colors.textMuted} />
          </View>
        )
      ) : (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.surfaceDim },
          ]}
        >
          <Ionicons name={iconName} size={32} color={colors.textMuted} />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text
          style={[
            typography.body,
            { color: colors.text, fontSize: 14 },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {truncateFilename(fileName)}
        </Text>
        {fileSize ? (
          <Text
            style={[
              typography.caption,
              { color: colors.textMuted, marginTop: 2 },
            ]}
          >
            {formatFileSize(fileSize)}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.6}
        style={[styles.removeBtn, { padding: 6 }]}
        hitSlop={12}
        accessibilityLabel="Remove attachment"
      >
        <Ionicons name="close-circle" size={18} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    maxWidth: "100%",
  },
  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  removeBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
});
