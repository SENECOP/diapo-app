import ConversationList from '../components/messages/ConversationList';
import MessageBox from '../components/messages/MessageBox';
import { useEffect, useState } from "react";
import AlerteReservation from "../components/AlerteReservation";
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Message = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [conversations, setConversations] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, messageInitial } = location.state || {};

  // Gérer l'alerte de réservation
  useEffect(() => {
    const alertFlag = localStorage.getItem("AlerteReservation");
    if (alertFlag === "true") {
      setShowAlert(true);
      localStorage.removeItem("AlerteReservation");
    }
  }, []);

  // Ajouter automatiquement le preneur à la liste des conversations (sans duplication)
  useEffect(() => {
    if (user?.pseudo) {
      setConversations(prev => {
        const exists = prev.find(conv => conv.pseudo === user.pseudo);
        if (exists) return prev;

        return [
          ...prev,
          {
            _id: Date.now(), // ID temporaire
            pseudo: user.pseudo,
            avatar: user.avatar || "https://via.placeholder.com/50",
            dernierMessage: "Merci pour les infos, je suis intéressé.",
            messageInitial: messageInitial,
          }
        ];
      });
    }
  }, [user, messageInitial]);

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
        {/* Liste des conversations à gauche */}
        <ConversationList conversations={conversations} />

        {/* Zone des messages à droite */}
        <MessageBox user={user} messageInitial={messageInitial} />
      </div>
    </div>
  );
};

export default Message;
