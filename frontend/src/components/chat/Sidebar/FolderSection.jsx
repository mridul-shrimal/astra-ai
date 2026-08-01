import { useTheme } from "../../../context/ThemeContext";
import FolderHeader from "./FolderHeader";
function FolderSection({
  folder,
  children,
  collapsed,
  toggleFolder,
  onRenameFolder,
  onDeleteFolder,
}) {
  const { theme } = useTheme();

  return (
    <div className="mb-4">
      {/* Folder Header */}
      <FolderHeader
  folder={folder}
  theme={theme}
  toggleFolder={toggleFolder}
  onRenameFolder={onRenameFolder}
  onDeleteFolder={onDeleteFolder}
/>

      {!collapsed && children}
    </div>
  );
}

export default FolderSection;