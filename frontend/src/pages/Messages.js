import ConversationList from '../components/messages/ConversationList';
import MessageBox from '../components/messages/MessageBox';
import { useEffect, useState, useContext } from "react";
import AlerteReservation from "../components/AlerteReservation";
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { MessageContext } from "../context/MessageContext";
import { socket } from '../socket';

const MessagePage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, conversation: initialConversation, don } = location.state || {};
  const { setUnreadMessages } = useContext(MessageContext);
  const [selectedConversation, setSelectedConversation] = useState(initialConversation || null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Alerte réservation
  useEffect(() => {
    const alertFlag = localStorage.getItem("AlerteReservation");
    if (alertFlag === "true") {
      setShowAlert(true);
      localStorage.removeItem("AlerteReservation");
    }
  }, []);

  // Gestion des nouveaux messages en temps réel
  useEffect(() => {
    if (!socket || !selectedConversation) return;

    const handleNewMessage = (message) => {
      if (message.conversation === selectedConversation._id) {
        setSelectedConversation(prev => ({
          ...prev,
          lastMessage: message
        }));
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [selectedConversation]);

  // Sélection depuis la liste des conversations
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setUnreadMessages((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen flex flex-col">
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

      <div className="flex flex-1">
        <ConversationList 
          currentUser={currentUser} 
          onSelectConversation={handleSelectConversation} 
        />
        
        {selectedConversation ? (
          <MessageBox 
            conversation={selectedConversation} 
            currentUser={currentUser} 
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;