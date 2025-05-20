import React from 'react';
import { useLocation } from "react-router-dom";
import MessageInput from './MessageInput';

export default function MessageBox() {
  const location = useLocation();
  const { user, messageInitial } = location.state || {};

  return (
    <div className="flex flex-col w-2/3 bg-white">
      {/* Header avec avatar et pseudo */}
      <div className="flex items-center gap-4 border-b p-4">
        <img
          src={user?.avatar || "https://via.placeholder.com/50"}
          alt=" "
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{user?.pseudo || "Utilisateur"}</h3>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Premier message envoyé par le preneur : image + description + message */}
        {messageInitial && (
          <div className="mb-2 flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
              <img
                src={messageInitial.image}
                alt="don"
                className="w-32 h-32 object-cover rounded mb-2"
              />
              <p className="text-sm mb-2">{messageInitial.description}</p>
              <div className="bg-white text-black rounded px-3 py-2 text-sm shadow">
                Merci pour les infos, je suis intéressé.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Boutons rapides + input */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2 mb-2">
          <button className="px-3 py-1 bg-purple-100 text-sm rounded-full hover:bg-purple-200">Demain</button>
          <button className="px-3 py-1 bg-purple-100 text-sm rounded-full hover:bg-purple-200">Ce soir</button>
          <button className="px-3 py-1 bg-purple-100 text-sm rounded-full hover:bg-purple-200">Peut-être la semaine prochaine</button>
        </div>
        <MessageInput />
      </div>
    </div>
  );
}
