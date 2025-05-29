import { useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function ConversationList({
  conversations: initialConversations = [],
  onSelectConversation,
}) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(null);
  const { user } = useContext(UserContext);

  // ➤ Connexion socket + gestion des nouveaux messages
  useEffect(() => {
    const socket = io("https://diapo-app.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;
    socket.emit("userConnected", currentUser?.pseudo);

    socket.on("receiveMessage", (msg) => {
      if (msg.recu_par === currentUser?.pseudo) {
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
            return [
              {
                pseudo:
                  msg.envoye_par === currentUser?.pseudo
                    ? msg.recu_par
                    : msg.envoye_par,
                dernierMessage: msg.contenu,
                messageInitial: msg,
              },
              ...prevConvs,
            ];
          }
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser?.pseudo]);

  // ➤ Chargement des conversations existantes
  useEffect(() => {
    if (!user) return;

    fetch(
      `https://diapo-app.onrender.com/api/messages/conversations/${user.pseudo}`
    )
      .then((res) => res.json())
      .then((data) => {
        const latestMessages = {};

        data.forEach((msg) => {
          const key =
            msg.don_id +
            "_" +
            (msg.envoye_par === user.pseudo ? msg.recu_par : msg.envoye_par);

          // On garde le message le plus récent pour chaque conversation
          if (!latestMessages[key] || new Date(msg.envoye_le) > new Date(latestMessages[key].envoye_le)) {
            latestMessages[key] = msg;
          }
        });

        const formatted = Object.values(latestMessages).map((msg) => ({
          pseudo:
            msg.envoye_par === user.pseudo ? msg.recu_par : msg.envoye_par,
          dernierMessage: msg.contenu,
          messageInitial: msg,
        }));


        setConversations(formatted);
      })
      .catch((err) => console.error("Erreur chargement conversations", err));
  }, [user]);

  // ➤ Lorsqu'on clique sur une conversation
  const handleSelect = (conv) => {
    const message = conv.messageInitial;
    const recuPar =
      message.envoye_par === currentUser.pseudo
        ? message.recu_par
        : message.envoye_par;

    setSelectedId(message._id || conv.pseudo);

    // ➤ Navigation vers MessagePage
    navigate("/message", {
      state: {
        user: currentUser,
        messageInitial: {
          don_id: message.don_id,
          envoye_par: currentUser.pseudo,
          recu_par: recuPar,
          image: message.image_url,
          description: message.description,
        },
      },
    });

    // ➤ Appel du callback externe
    onSelectConversation?.(conv);
  };

  return (
    <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>

      {conversations.length === 0 ? (
        <p className="text-gray-500">Aucune conversation</p>
      ) : (
        <ul>
          {conversations.map((conv) => {
            const id = conv.messageInitial?._id || conv.pseudo;
            const isSelected = selectedId === id;

            return (
              <li
                key={id}
                onClick={() => handleSelect(conv)}
                className={`p-2 border-b cursor-pointer ${
                  isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                <div className="font-semibold">
                  {conv.pseudo || "Utilisateur inconnu"}
                </div>
                <div className="text-sm text-gray-500">
                  {conv.dernierMessage || "Aucun message"}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
