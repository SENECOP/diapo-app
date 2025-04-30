import ConversationList from './ConversationList';
import MessageBox from './MessageBox';
import { useEffect, useState } from "react";
import AlerteReservation from "../AlerteReservation";
import Header from '../Header';

const Message = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const alertFlag = localStorage.getItem("AlerteReservation");
    if (alertFlag === "true") {
      setShowAlert(true);
      localStorage.removeItem("AlerteReservation"); // enlever après affichage
    }
  }, []);

  return (
    <div className="p-4">
        <Header /> 
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {showAlert && <AlerteReservation onClose={() => setShowAlert(false)} />}

  
      <div className="flex h-screen">
      {/* Liste des conversations à gauche */}
      <ConversationList />

      {/* Zone de messages à droite */}
      <MessageBox />
    </div>
    </div>
  );
};

export default Message;


