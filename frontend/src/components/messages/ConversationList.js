import { useEffect, useRef, useState, useContext } from "react"; // Ajout de useContext
import { io } from "socket.io-client";
import { UserContext } from "../../context/UserContext";

export default function ConversationList({
  conversations: initialConversations = [],
  onSelectConversation,
}) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState(initialConversations);
  const { user } = useContext(UserContext); // Utilisation correcte

  useEffect(() => {
    const socket = io("https://diapo-app.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.emit("userConnected", currentUser?.pseudo);

    socket.on("receiveMessage", (msg) => {
      if (msg.recu_par === currentUser?.pseudo) {
        console.log("📥 Nouveau message reçu :", msg);

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
                  }
                : conv
            );
          } else {
            return [
              {
                pseudo: msg.envoye_par,
                dernierMessage: msg.contenu,
                messageInitial: {
                  don_id: msg.don_id,
                  envoye_par: msg.envoye_par,
                  recu_par: msg.recu_par,
                  description: "",
                  image: "",
                },
              },
              ...prevConvs,
            ];
          }
        });
      }
    });

    return () => {
      socket.disconnect();
      console.log("🔌 Socket déconnecté dans ConversationList");
    };
  }, [currentUser?.pseudo]);

  // ✅ Correction : Ne pas inclure `user` comme dépendance car c’est déjà extrait de useContext
  
  useEffect(() => {
    if (!user) return;

    fetch(`https://diapo-app.onrender.com/api/conversations/${user.pseudo}`)
      .then((res) => res.json())
      .then((data) => setConversations(data))
      .catch((err) => console.error("Erreur chargement conversations", err));
  }, [user]); // ✅ Dépendance plus précise

  return (
    <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>

      <ul>
        {conversations.length === 0 ? (
          <p className="text-gray-500">Aucune conversation</p>
        ) : (
          conversations.map((conv, index) => (
            <li
              key={conv._id || `${conv.pseudo}-${index}`}
              className="p-2 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectConversation?.(conv)}
            >
              <div className="font-semibold">
                {conv.pseudo || "Preneur inconnu"}
              </div>
              <div className="text-sm text-gray-500">
                {conv.dernierMessage || "Aucun message"}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
