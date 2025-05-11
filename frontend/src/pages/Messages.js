import { useEffect, useState } from "react";
import AlerteReservation from "../components/AlerteReservation";
import { useLocation } from "react-router-dom";

const Message = () => {
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const alertFromState = location.state?.showReservationAlert;
    const alertFromStorage = localStorage.getItem("AlerteReservation") === "true";

    if (alertFromState || alertFromStorage) {
      setShowAlert(true);
      localStorage.removeItem("AlerteReservation");
    }
  }, [location.state]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {showAlert && <AlerteReservation onClose={() => setShowAlert(false)} />}

      {/* autres contenus */}
    </div>
  );
};

export default Message;
