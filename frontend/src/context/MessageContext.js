import { createContext, useState } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [activeConversationId, setActiveConversationId] = useState(null); // 👈 conversation actuellement ouverte

  return (
    <MessageContext.Provider
      value={{
        unreadMessages,
        setUnreadMessages,
        activeConversationId,
        setActiveConversationId, 
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
