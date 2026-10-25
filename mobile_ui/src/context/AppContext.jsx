import { createContext, useContext } from "react";

import useAuth from "../hooks/useAuth";
import useConversations from "../hooks/useConversations";
import useMessages from "../hooks/useMessages";
import useChat from "../hooks/useChat";
import usePreferences from "../hooks/usePreferences";

const AppContext = createContext();

export function AppProvider({ children }) {
  const auth = useAuth();
  const preferences = usePreferences();
  const conversations = useConversations(auth.session);
  const messages = useMessages(auth.session, conversations.selectedConversation);
  const chat = useChat(
    auth.session,
    conversations.selectedConversation,
    preferences.preferences,
    conversations.renameConversation
  );

  return (
    <AppContext.Provider
      value={{
        auth,
        preferences,
        conversations,
        messages,
        chat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
