import { useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../../context/UserContext";

export default function ConversationList({ onSelectConversation }) {
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const { user: userFromContext } = useContext(UserContext);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = storedUser || userFromContext;

  // 🔁 Chargement des conversations
  useEffect(() => {
    const pseudo = currentUser?.pseudo;
    if (!pseudo) return;

    fetch(`https://diapo-app.onrender.com/api/messages/conversations/${pseudo}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .map((conv) => {
            const message = conv.messageInitial || conv.lastMessage || null;

            if (!message || !message.don_id || !message.envoye_par || !message.recu_par) {
              console.warn("❌ Conversation ignorée (message incomplet)", conv);
              return null;
            }

            return {
              interlocuteur: conv.interlocuteur || conv._id || "Inconnu",
              nomComplet: conv.nomComplet || "",
              avatar: `https://ui-avatars.com/api/?name=${conv.interlocuteur || conv._id}`,
              dernierMessage: message.contenu || "",
              messageInitial: message,
              nonLus: conv.nonLus || false,
            };
          })
          .filter(Boolean);

        setConversations(formatted);
      })
      .catch((err) => console.error("Erreur chargement conversations", err));
  }, [currentUser?.pseudo]);

  // 🔌 Mise à jour via socket
  useEffect(() => {
    if (!currentUser?.pseudo) return;

    const socket = io("https://diapo-app.onrender.com", {
      transports: ["polling"],
      reconnection: true,
    });

    socketRef.current = socket;
    socket.emit("userConnected", currentUser.pseudo);

    socket.on("receiveMessage", (msg) => {
      if (
        msg.recu_par !== currentUser.pseudo &&
        msg.envoye_par !== currentUser.pseudo
      )
        return;

      setConversations((prevConvs) => {
        const index = prevConvs.findIndex(
          (c) =>
            c.messageInitial?.don_id === msg.don_id &&
            (c.messageInitial?.envoye_par === msg.envoye_par ||
              c.messageInitial?.recu_par === msg.envoye_par)
        );

        const updatedConv = {
          interlocuteur:
            msg.envoye_par === currentUser.pseudo
              ? msg.recu_par
              : msg.envoye_par,
          avatar: `https://ui-avatars.com/api/?name=${msg.envoye_par}`,
          nomComplet: "",
          dernierMessage: msg.contenu,
          messageInitial: msg,
          nonLus: msg.recu_par === currentUser.pseudo, // 🔴 si c'est un message entrant
        };

        if (index !== -1) {
          const updated = [...prevConvs];
          updated.splice(index, 1);
          return [updatedConv, ...updated];
        } else {
          return [updatedConv, ...prevConvs];
        }
      });
    });

    return () => socket.disconnect();
  }, [currentUser?.pseudo]);

  // 🎯 Sélection d'une conversation
  const handleSelect = (conv) => {
    const message = conv.messageInitial;

    if (!message || !message.envoye_par || !message.recu_par) {
      console.warn("Conversation mal formatée :", conv);
      return;
    }

    const recuPar =
      message.envoye_par === currentUser.pseudo
        ? message.recu_par
        : message.envoye_par;

    const id = message._id || `${conv.interlocuteur}-${message.don_id}`;
    setSelectedId(id);

    const formattedConv = {
      pseudo: recuPar,
      avatar: conv.avatar || `https://ui-avatars.com/api/?name=${recuPar}`,
      messageInitial: {
        don_id: message.don_id,
        image: message.image || message.image_url || "",
        description: message.description || "",
        envoye_par: message.envoye_par,
        recu_par: message.recu_par,
        contenu: message.contenu || "",
      },
    };

    onSelectConversation?.(formattedConv);
    // Marquer les messages comme lus
fetch(`https://diapo-app.onrender.com/api/messages/read/${message.don_id}/${currentUser.pseudo}/${recuPar}`, {
  method: "PATCH",
})
  .then(() => {
    setConversations((prev) =>
      prev.map((c) => {
        if (
          c.messageInitial?.don_id === message.don_id &&
          (c.messageInitial?.envoye_par === recuPar || c.messageInitial?.recu_par === recuPar)
        ) {
          return { ...c, nonLus: false };
        }
        return c;
      })
    );
  })
  .catch((err) => console.error("Erreur marquage comme lu", err));

  };

  return (
    <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>

      {conversations.length === 0 ? (
        <p className="text-gray-500">Aucune conversation</p>
      ) : (
        <ul>
          {conversations.map((conv, index) => {
            const id =
              conv.messageInitial?._id ||
              `${conv.interlocuteur}-${conv.messageInitial?.don_id}` ||
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
                  src={conv.avatar}
                  alt={conv.interlocuteur}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    {conv.nomComplet || conv.interlocuteur || "Utilisateur inconnu"}
                    {conv.nonLus && (
                      <span className="ml-1 w-2 h-2 bg-red-500 rounded-full inline-block" />
                    )}
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
