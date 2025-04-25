import { useEffect, useState } from "react";
import AlerteReservation from "../components/AlerteReservation";

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
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {showAlert && <AlerteReservation onClose={() => setShowAlert(false)} />}

      {/* autres contenus */}
    </div>
  );
};

export default Message;
