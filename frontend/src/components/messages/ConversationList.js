import { useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function ConversationList({
  conversations: initialConversations = [],
  onSelectConversation,
}) {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(null);

  const { user: userFromContext } = useContext(UserContext);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = storedUser || userFromContext;

  // ✅ Synchroniser avec les props
  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  // ✅ Connexion socket et écoute des nouveaux messages
  useEffect(() => {
    if (!currentUser?.pseudo) return;

    const socket = io("https://diapo-app.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;
    socket.emit("userConnected", currentUser.pseudo);

    socket.on("receiveMessage", (msg) => {
      if (msg.recu_par === currentUser.pseudo) {
        setConversations((prevConvs) => {
          const existing = prevConvs.find(
            (c) =>
              c.messageInitial?.don_id === msg.don_id &&
              (c.messageInitial?.envoye_par === msg.envoye_par ||
                c.messageInitial?.recu_par === msg.envoye_par)
          );

          if (existing) {
            return prevConvs.map((conv) =>
              conv.messageInitial?.don_id === msg.don_id &&
              (conv.messageInitial?.envoye_par === msg.envoye_par ||
                conv.messageInitial?.recu_par === msg.envoye_par)
                ? {
                    ...conv,
                    dernierMessage: msg.contenu,
                    messageInitial: msg,
                  }
                : conv
            );
          } else {
            const newConv = {
              pseudo:
                msg.envoye_par === currentUser.pseudo
                  ? msg.recu_par
                  : msg.envoye_par,
              dernierMessage: msg.contenu,
              messageInitial: msg,
            };
            return [newConv, ...prevConvs];
          }
        });
      }
    });

    return () => socket.disconnect();
  }, [currentUser?.pseudo]);

  // ✅ Chargement initial des conversations
  useEffect(() => {
    const pseudo = currentUser?.pseudo;
    if (!pseudo) return;
    
    fetch(`https://diapo-app.onrender.com/api/messages/conversations/${pseudo}`)
      .then((res) => res.json())
      .then((data) => {
        const latestMessages = {};

        data.forEach((msg) => {
          const key =
            msg.don_id +
            "_" +
            (msg.envoye_par === pseudo ? msg.recu_par : msg.envoye_par);

          if (
            !latestMessages[key] ||
            new Date(msg.envoye_le) > new Date(latestMessages[key].envoye_le)
          ) {
            latestMessages[key] = msg;
          }
        });

        const formatted = Object.values(latestMessages).map((msg) => ({
          pseudo: msg.envoye_par === pseudo ? msg.recu_par : msg.envoye_par,
          dernierMessage: msg.contenu,
          messageInitial: msg,
        }));

        setConversations((prev) => {
          const unique = formatted.filter(
            (newConv) =>
              !prev.some(
                (prevConv) =>
                  prevConv.pseudo === newConv.pseudo &&
                  prevConv.messageInitial?.don_id === newConv.messageInitial?.don_id
              )
          );
          return [...unique, ...prev];
        });
      })
      .catch((err) => console.error("Erreur chargement conversations", err));
  }, [currentUser?.pseudo]);

  // ✅ Sélection d'une conversation
  const handleSelect = (conv) => {
    const message = conv.messageInitial;
    const recuPar =
      message.envoye_par === currentUser.pseudo
        ? message.recu_par
        : message.envoye_par;

    const id = message._id || `${conv.pseudo}-${message.don_id}`;
    setSelectedId(id);

    navigate("/message", {
      state: {
        user: currentUser,
        messageInitial: {
          don_id: message.don_id,
          envoye_par: currentUser.pseudo,
          recu_par: recuPar,
          image: message.image || message.image_url,
          description: message.description,
          contenu: message.contenu,
        },
      },
    });

    onSelectConversation?.(conv);
  };

  return (
    <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>

      {conversations.length === 0 ? (
        <p className="text-gray-500">Aucune conversation</p>
      ) : (
        <ul>
          {conversations
            .filter((conv) => conv.pseudo && conv.messageInitial)
            .map((conv, index) => {
              const id =
                conv.messageInitial?._id ||
                `${conv.pseudo}-${conv.messageInitial?.don_id}` ||
                `conv-${index}`;

              const isSelected = selectedId === id;

              return (
                <li
                  key={id}
                  onClick={() => handleSelect(conv)}
                  className={`p-2 border-b cursor-pointer flex items-center gap-3 ${
                    isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={
                      conv.avatar ||
                      `https://ui-avatars.com/api/?name=${conv.pseudo}`
                    }
                    alt={conv.pseudo}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">
                      {conv.nomComplet || conv.pseudo || "Utilisateur inconnu"}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {conv.dernierMessage || "Aucun message"}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
