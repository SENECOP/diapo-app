import React from "react";

const NotificationCard = ({ titre, message, onVoir, onIgnorer }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-72 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <img src="/logo_diapo.png" alt="Diapo Logo" className="h-16 w-auto" />
          <h4 className="font-bold text-gray-800">{titre}</h4>
        </div>
        <span className="text-xs text-gray-400">Maintenant</span>
      </div>
      <p className="text-sm text-gray-700 mb-4">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onIgnorer}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Ignorer
        </button>
        <button
          onClick={onVoir}
          className="text-sm bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
        >
          Voir
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
