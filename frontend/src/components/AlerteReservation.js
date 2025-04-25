import React from "react";
import { useNavigate } from "react-router-dom";

const AlerteReservation = ({ onClose }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    onClose(); // Ferme l'alerte
    navigate("/dashboard"); // Redirige vers dashboard
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-md z-50">
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md max-w-md mx-auto mt-6">
        <h2 className="text-lg font-semibold mb-2">Article reservé</h2>
        <p className="text-gray-700 mb-4">
          Une notification est envoyée au donneur de l’article, merci
          d’attendre qu’il vous contacte.
        </p>
        <div className="text-right">
          <button
            onClick={handleRedirect}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Trouver d’autres articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlerteReservation;
