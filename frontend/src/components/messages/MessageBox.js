import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import MessageInput from './MessageInput';
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://diapo-app.onrender.com/api/messages';

export default function MessageBox() {
  const location = useLocation();
  const { user, messageInitial } = location.state || {};

  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const destinatairePseudo =
    messageInitial?.envoye_par === user?.pseudo
      ? messageInitial?.recu_par
      : messageInitial?.envoye_par;

  const destinataireAvatar = `https://ui-avatars.com/api/?name=${destinatairePseudo}`;

  useEffect(() => {
    if (!user || !messageInitial || !messageInitial.don_id) return;
    

    const socket = io('https://diapo-app.onrender.com', {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    console.log("📡 Connexion WebSocket...");
    socket.on('connect', () => {
      console.log("✅ Connecté au WebSocket :", socket.id);
      socket.emit("userConnected", user.pseudo);
    });

    socket.on('connect_error', (err) => {
      console.error("❌ Erreur de connexion :", err.message);
    });

    const donId = messageInitial.don_id;
    const user1 = user.pseudo;
    const user2 = destinatairePseudo;

    // Charger les anciens messages
    fetch(`${API_BASE_URL}/${donId}/${user1}/${user2}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de récupération des messages');
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch((err) => {
        console.error('Erreur lors du fetch des messages:', err);
      });

    // Réception des nouveaux messages
    const handleReceiveMessage = (msg) => {
      if (
        msg.don_id === messageInitial.don_id &&
        (msg.envoye_par === user.pseudo || msg.recu_par === user.pseudo)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.disconnect();
      console.log("🔌 Déconnecté du WebSocket");
    };
  }, [user, messageInitial, destinatairePseudo]);

  const handleSendMessage = (content) => {
    if (!socketRef.current) return;

    const newMessage = {
      contenu: content,
      don_id: messageInitial.don_id,
      envoye_par: user.pseudo,
      recu_par: destinatairePseudo,
    };

    console.log("🟡 Envoi du message :", newMessage);
    socketRef.current.emit('sendMessage', newMessage);
    setMessages((prev) => [...prev, newMessage]);
  };

  if (!user || !messageInitial) {
    return <div className="p-4 text-red-500">❌ Données utilisateur ou message manquantes.</div>;
  }

  return (
    <div className="flex flex-col w-2/3 bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 border-b p-4">
        <img
          src={destinataireAvatar}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{destinatairePseudo || "Utilisateur"}</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messageInitial && (
          <div className="mb-2 flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
              {messageInitial.image && (
                <img
                  src={messageInitial.image}
                  alt="don"
                  className="w-32 h-32 object-cover rounded mb-2"
                />
              )}
              <p className="text-sm mb-2">{messageInitial.description}</p>
              <div className="bg-white text-black rounded px-3 py-2 text-sm shadow">
                Merci pour les infos, je suis intéressé.
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isSender = msg.envoye_par === user.pseudo;
          return (
            <div
              key={index}
              className={`mb-2 flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 max-w-xs rounded-lg text-sm shadow-md ${
                  isSender
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.contenu}
              </div>
            </div>
          );
        })}

      </div>

      {/* Input + Suggestions */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2 mb-2">
          {["Demain", "Ce soir", "Peut-être la semaine prochaine"].map((text) => (
            <button
              key={text}
              className="px-3 py-1 bg-purple-100 text-sm rounded-full hover:bg-purple-200"
              onClick={() => handleSendMessage(text)}
            >
              {text}
            </button>
          ))}
        </div>

        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
