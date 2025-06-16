import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";

const ConversationList = ({ currentUser, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!currentUser?._id) return;
        
        const response = await axios.get(
          `http://localhost:5000/api/messages/user/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setConversations(response.data || []);
      } catch (err) {
        console.error("Erreur récupération des conversations:", err);
        setError("Impossible de charger les conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser, token]);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-1/3 border-r overflow-y-auto">
      {conversations.length > 0 ? (
        conversations.map((conversation) => {
          const otherUser = conversation.participants.find(
            p => p._id !== currentUser._id
          );

          return (
            <div
              key={conversation._id}
              className="p-4 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectConversation({
                ...conversation,
                otherUser
              })}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{otherUser?.pseudo}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.don?.titre}
                  </p>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-4 text-gray-500">
          Aucune conversation trouvée
        </div>
      )}
    </div>
  );
};

export default ConversationList;