import ConversationList from '../components/messages/ConversationList';
import MessageBox from '../components/messages/MessageBox';
import { useEffect, useState, useContext } from "react";
import AlerteReservation from "../components/AlerteReservation";
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { MessageContext } from "../context/MessageContext";

const MessagePage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, messageInitial, don } = location.state || {};
  const { setUnreadMessages } = useContext(MessageContext);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Calcul du destinataire dans la conversation initiale
  const destinataire = messageInitial?.envoye_par === user?.pseudo
    ? messageInitial?.recu_par
    : messageInitial?.envoye_par;

  // Quand on sélectionne une conversation dans la liste
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);

    // Décrémente les messages non lus
    setUnreadMessages((prev) => Math.max(prev - 1, 0));
  };

  // Si on arrive sur la page avec une conversation initiale, on la sélectionne automatiquement
  useEffect(() => {
    if (messageInitial && destinataire) {
      setSelectedConversation({
        pseudo: destinataire,
        messageInitial,
        avatar: "https://ui-avatars.com/api/?name=" + destinataire,
        dernierMessage: messageInitial.contenu || "",
        don: don,
      });
    }
  }, [messageInitial, destinataire, don]);

  useEffect(() => {
    const alertFlag = localStorage.getItem("AlerteReservation");
    if (alertFlag === "true") {
      setShowAlert(true);
      localStorage.removeItem("AlerteReservation");
    }
  }, []);

  useEffect(() => {
    const savedConversations = JSON.parse(localStorage.getItem("conversations") || "[]");
    setConversations(savedConversations);
  }, []);

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  // Ajoute une nouvelle conversation si besoin, par exemple si messageInitial est reçu via la navigation
  useEffect(() => {
    if (destinataire && messageInitial?.don_id) {
      setConversations((prev) => {
        const alreadyExists = prev.some(
          (conv) => conv.pseudo === destinataire && conv.messageInitial?.don_id === messageInitial.don_id
        );

        if (!alreadyExists) {
          const newConv = {
            _id: Date.now(),
            pseudo: destinataire,
            avatar: `https://ui-avatars.com/api/?name=${destinataire}`,
            dernierMessage: messageInitial?.contenu || "Nouveau message",
            messageInitial: {
              don_id: messageInitial.don_id,
              image: messageInitial.image,
              description: messageInitial.description,
              envoye_par: messageInitial.envoye_par,
              recu_par: messageInitial.recu_par,
            },
          };
          return [...prev, newConv];
        }
        return prev;
      });
    }
  }, [destinataire, messageInitial]);

  return (
    <div className="p-4">
      <Header />

      <div className="bg-blue-700 text-white px-10 py-10 flex items-center h-[250px] space-x-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-full bg-white text-blue-700 hover:bg-gray-100 shadow"
            title="Retour au tableau de bord"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-semibold">Messages</h1>
        </div>
      </div>

      {showAlert && <AlerteReservation onClose={() => setShowAlert(false)} />}

      <div className="flex h-screen">
        <ConversationList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
        />
        {selectedConversation ? (
          <MessageBox conversation={selectedConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sélectionne une conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
