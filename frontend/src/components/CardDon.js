const CardDon = ({ titre = "Chaise de confort",   ville_don = "Dakar", categorie = "Meuble", temps = "il y a 2 heures" }) => {
    return (
      <div className="bg-gray-100 p-4 rounded shadow w-full">
        <div className="w-full h-32 bg-gray-300 rounded mb-3"></div>
        <h3 className="font-semibold">{titre}</h3>
        <p className="text-sm text-gray-600">{  ville_don} • {categorie} • {temps}</p>
      </div>
    );
  };
  
  export default CardDon;
  