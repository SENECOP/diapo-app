import { reserverDon } from "../Services/donService";

const ReserverDon = ({ donId, userId }) => {
  const handleReservation = async () => {
    await reserverDon(donId, userId);
    alert("Don réservé !");
  };

  return (
    <button onClick={handleReservation} className="bg-green-500 text-white p-2 rounded">Réserver</button>
  );
};

export default ReserverDon;
