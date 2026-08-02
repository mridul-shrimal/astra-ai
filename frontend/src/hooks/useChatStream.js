
function useChatStream({
  updateCurrentMessages,
  stopGenerationRef,
  setIsTyping,
  setIsGenerating,
}) {
  

  // =========================
  // Stream Message
  // =========================

  const streamMessage = async (
    text,
    messageId,
    existingMessages
  ) => {
    let current = "";

    for (let i = 0; i < text.length; i += 3) {
      if (stopGenerationRef.current) {
        setIsTyping(false);
        setIsGenerating(false);
        return;
      }

      current += text.slice(i, i + 3);

      updateCurrentMessages(
        existingMessages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                message: current,
              }
            : msg
        )
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 8)
      );
    }
  };

  return {
  streamMessage,
};
}

export default useChatStream;