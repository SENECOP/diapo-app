import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import MessageInput from './MessageInput';
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://diapo-app.onrender.com/api/messages';

export default function MessageBox() {
  const location = useLocation();
  const { user, messageInitial } = location.state || {};

  console.log("✅ Chargement MessageBox");
  console.log("👤 user =", user);
  console.log("📨 messageInitial =", messageInitial);

  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null); // ✅ Garde une seule instance de socket

  useEffect(() => {
    const socket = io('https://diapo-app.onrender.com', {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    console.log("📡 Tentative de connexion WebSocket...");

    socket.on('connect', () => {
      console.log("✅ Connecté au serveur WebSocket :", socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error("❌ Erreur de connexion WebSocket :", err.message);
    });

    const donId = messageInitial?.don_id;
    const user1 = user?.pseudo;
    const user2 = messageInitial?.envoye_par === user?.pseudo
      ? messageInitial?.recu_par
      : messageInitial?.envoye_par;

    if (!donId || !user1 || !user2) return;

    // 🔄 Fetch messages existants
    fetch(`${API_BASE_URL}/${donId}/${user1}/${user2}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de récupération des messages');
        return res.json();
      })
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => {
        console.error('Erreur lors du fetch des messages:', err);
      });

    // 📥 Nouveau message reçu
    socket.on('receiveMessage', (data) => {
      if (
        data.don_id === donId &&
        data.envoye_par !== user1 && // ⛔️ ignorer si c’est soi-même (on l’a déjà ajouté)
        (data.envoye_par === user2 || data.recu_par === user2)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.disconnect(); // ✅ Nettoyage à la fin
      console.log("🔌 Déconnecté du serveur WebSocket");
    };
  }, [messageInitial, user]);

  const handleSendMessage = (content) => {
    if (!socketRef.current) return;

    const newMessage = {
      contenu: content,
      don_id: messageInitial?.don_id,
      envoye_par: user?.pseudo,
      recu_par:
        messageInitial?.envoye_par === user?.pseudo
          ? messageInitial?.recu_par
          : messageInitial?.envoye_par,
    };

    socketRef.current.emit('sendMessage', newMessage); // ✅ Envoie via socket
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col w-2/3 bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 border-b p-4">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <h3 className="font-semibold text-lg">{user?.pseudo || "Utilisateur"}</h3>
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

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.envoye_par === user?.pseudo ? 'justify-end' : 'justify-start'}`}
          >
            <div className="bg-blue-200 rounded-lg p-3 max-w-xs text-sm">
              {msg.contenu}
            </div>
          </div>
        ))}
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
