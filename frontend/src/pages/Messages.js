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
  const navigate = useNavigate();
  const location = useLocation();
  const { user, messageInitial, don } = location.state || {};
  const { setUnreadMessages } = useContext(MessageContext);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // 👉 Conversation initiale
  const destinataire = messageInitial?.envoye_par === user?.pseudo
    ? messageInitial?.recu_par
    : messageInitial?.envoye_par;

  // Sélection automatique si conversation initiale
  useEffect(() => {
    if (messageInitial && destinataire) {
      setSelectedConversation({
        pseudo: destinataire,
        interlocuteur: destinataire,
        messageInitial,
        avatar: "https://ui-avatars.com/api/?name=" + destinataire,
        dernierMessage: messageInitial.contenu || "",
        don: don,
      });
    }
  }, [messageInitial, destinataire, don]);

  // Alerte réservation
  useEffect(() => {
    const alertFlag = localStorage.getItem("AlerteReservation");
    if (alertFlag === "true") {
      setShowAlert(true);
      localStorage.removeItem("AlerteReservation");
    }
  }, []);

  // Sélection depuis la liste des conversations
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setUnreadMessages((prev) => Math.max(prev - 1, 0));
  };

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
        {/* ❗️On ne passe plus les conversations en props (elles sont chargées dans ConversationList) */}
        <ConversationList onSelectConversation={handleSelectConversation} />
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
