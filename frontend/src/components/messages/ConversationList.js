import { useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../../context/UserContext";

export default function ConversationList({
  conversations: initialConversations = [],
  onSelectConversation,
}) {
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const { user: userFromContext } = useContext(UserContext);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = storedUser || userFromContext;
console.log("currentUser complet :", currentUser);

  // Charger les conversations
 useEffect(() => {
  const userId = currentUser?.id;
  if (!userId) return;

  console.log("userId utilisé pour fetch:", userId);

  fetch(`https://diapo-app.onrender.com/api/messages/conversations/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Réponse brute de l'API:", data);

      if (Array.isArray(data)) {
        const formatted = data.map((conv) => ({
          interlocuteur: conv.interlocuteur,
          avatar: `https://ui-avatars.com/api/?name=${conv.interlocuteur}`,
          dernierMessage: conv.lastMessage?.content,
          messageInitial: conv.lastMessage?.createdAt,
          don: conv.lastMessage?.don || null,
        }));
        setConversations(formatted);
      } else {
        console.error("Réponse inattendue :", data);
      }
    })
    .catch((err) => console.error("Erreur chargement conversations", err));
}, [currentUser]);



  // Socket
  useEffect(() => {
    if (!currentUser?.pseudo) return;

    const socket = io("https://diapo-app.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;
    socket.emit("userConnected", currentUser.pseudo);

    socket.on("receiveMessage", (msg) => {
      if (msg.recu_par !== currentUser.pseudo && msg.envoye_par !== currentUser.pseudo) return;

      setConversations((prevConvs) => {
        const idx = prevConvs.findIndex(
          (c) =>
            c.messageInitial?.don_id === msg.don_id &&
            (c.messageInitial?.envoye_par === msg.envoye_par ||
              c.messageInitial?.recu_par === msg.envoye_par)
        );

        if (idx !== -1) {
          const updated = [...prevConvs];
          updated[idx] = {
            ...updated[idx],
            dernierMessage: msg.contenu,
            messageInitial: msg,
          };
          return [updated[idx], ...updated.filter((_, i) => i !== idx)];
        } else {
          const newConv = {
            interlocuteur: msg.envoye_par === currentUser.pseudo ? msg.recu_par : msg.envoye_par,
            avatar: `https://ui-avatars.com/api/?name=${msg.envoye_par}`,
            dernierMessage: msg.contenu,
            messageInitial: msg,
            don: null, // pas encore connu
          };
          return [newConv, ...prevConvs];
        }
      });
    });

    return () => socket.disconnect();
  }, [currentUser?.pseudo]);

  const handleSelect = (conv) => {
    const msg = conv.messageInitial;
    const recuPar = msg.envoye_par === currentUser.pseudo ? msg.recu_par : msg.envoye_par;

    const id = msg._id || `${conv.interlocuteur}-${msg.don_id}`;
    setSelectedId(id);

    const formattedConv = {
      pseudo: recuPar,
      avatar: conv.avatar,
      messageInitial: msg,
      don: conv.don || null,
    };

    onSelectConversation?.(formattedConv);
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
                  <div className="font-semibold">{conv.interlocuteur}</div>
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
