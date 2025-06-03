import React, { useEffect, useRef, useState } from 'react';
import MessageInput from './MessageInput';
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://diapo-app.onrender.com/api/messages';

export default function MessageBox({ conversation }) {
  const {
    messageInitial,
    don,
    pseudo: destinatairePseudo,
    avatar: destinataireAvatar,
  } = conversation || {};

  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user || !messageInitial?.don_id) return;

    const socket = io('https://diapo-app.onrender.com', {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit("userConnected", user.pseudo);
    });

    socket.on("receiveMessage", (msg) => {
      if (
        msg.don_id === messageInitial.don_id &&
        (msg.envoye_par === user.pseudo || msg.recu_par === user.pseudo)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    fetch(`${API_BASE_URL}/${messageInitial.don_id}/${user.pseudo}/${destinatairePseudo}`)
      .then((res) => res.json())
      .then(setMessages)
      .catch((err) => console.error("Erreur fetch messages :", err));

    return () => {
      socket.disconnect();
    };
  }, [user, messageInitial, destinatairePseudo]);

  const handleSendMessage = async (content) => {
  const newMessage = {
    contenu: content,
    don_id: messageInitial.don_id,
    envoye_par: user.pseudo,
    recu_par: destinatairePseudo,
  };

  try {
    // ✅ enregistrer dans la base de données
    const res = await fetch('https://diapo-app.onrender.com/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    });

    if (!res.ok) throw new Error("Erreur lors de l'enregistrement du message");

    const savedMessage = await res.json();

    // ✅ envoyer via socket
    socketRef.current?.emit('sendMessage', savedMessage);

    // ✅ afficher localement
    setMessages((prev) => [...prev, savedMessage]);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
  }
};


    if (!conversation || !messageInitial || !messageInitial.don_id || !user) {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-400 italic">
      Chargement de la conversation...
    </div>
  );
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
          <h3 className="font-semibold text-lg">
            {destinatairePseudo || "Utilisateur"}
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">

        {/* Affichage du don */}
        {don && (
          <div className="mb-4 p-4 border rounded bg-purple-50">
            <h3 className="text-lg font-bold text-purple-800 mb-2">
              {don.titre}
            </h3>
            {don.image_url && (
              <img
                src={don.image_url}
                alt="don"
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}
            <p className="text-gray-700 text-sm">{don.description}</p>
          </div>
        )}

        {/* Affichage du message initial si aucun autre message */}
        {messageInitial && messages.length === 0 && (
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

        {/* Affichage de la liste des messages */}
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
