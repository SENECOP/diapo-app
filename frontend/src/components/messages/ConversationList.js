import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { socket } from "../../socket";

const ConversationList = () => {
  const currentUser = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);

  // 🔁 Récupération initiale des conversations (si nécessaire)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
        `https://diapo-app.onrender.com/user/${currentUser.pseudo}`
        );
        setConversations(res.data);
      } catch (err) {
        console.error("Erreur récupération des conversations", err);
      }
    };

    if (currentUser?.pseudo) {
      fetchConversations();
    }
  }, [currentUser]);

  // ✅ Fonction pour aller chercher la conversation complète si elle n'existe pas
  const fetchConversationFromBackend = async (donId, pseudo1, pseudo2) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/conversation?don_id=${donId}&utilisateur1=${pseudo1}&utilisateur2=${pseudo2}`
      );
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la récupération de la conversation :", err);
      return null;
    }
  };

  // 📩 Gérer les nouveaux messages reçus par socket
  useEffect(() => {
    if (!socket || !currentUser?.pseudo) return;

    const handleReceiveMessage = async (msg) => {
      const exists = conversations.some(
        (conv) =>
          conv.don_id === msg.don_id &&
          (conv.interlocuteur === msg.envoye_par ||
            conv.interlocuteur === msg.recu_par)
      );

      if (!exists) {
        const pseudo1 = currentUser.pseudo;
        const pseudo2 =
          msg.envoye_par === currentUser.pseudo ? msg.recu_par : msg.envoye_par;

        const conv = await fetchConversationFromBackend(
          msg.don_id,
          pseudo1,
          pseudo2
        );

        if (conv) {
          setConversations((prev) => [
            ...prev,
            {
              don_id: conv.don_id,
              interlocuteur: pseudo2,
              messageInitial: conv.messageInitial,
              description: conv.description,
              image: conv.image,
            },
          ]);
        } else {
          setConversations((prev) => [
            ...prev,
            {
              don_id: msg.don_id,
              interlocuteur: pseudo2,
              messageInitial: msg,
            },
          ]);
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Nettoyage à la destruction du composant
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [conversations, currentUser]);

  return (
    <div className="conversation-list">
      {conversations.map((conv, index) => (
        <div key={index} className="conversation-card">
          <p><strong>Avec :</strong> {conv.interlocuteur}</p>
          <p><strong>Message :</strong> {conv.messageInitial?.contenu || "Aucun message"}</p>
          {conv.description && <p><strong>Description :</strong> {conv.description}</p>}
          {conv.image && <img src={conv.image} alt="don" style={{ width: "100px" }} />}
        </div>
      ))}
    </div>
  );
};

export default ConversationList;