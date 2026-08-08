import { useEffect } from "react";

function useChatPersistence({
  folders,
  tags,
}) {
  // Save folders
  useEffect(() => {
    localStorage.setItem(
      "astra-folders",
      JSON.stringify(folders)
    );
  }, [folders]);

  // Save tags
  useEffect(() => {
    localStorage.setItem(
      "astra-tags",
      JSON.stringify(tags)
    );
  }, [tags]);
}

export default useChatPersistence;