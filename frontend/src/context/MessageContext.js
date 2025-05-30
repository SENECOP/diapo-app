import { createContext, useState } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);

  return (
    <MessageContext.Provider value={{ unreadMessages, setUnreadMessages }}>
      {children}
    </MessageContext.Provider>
  );
};
