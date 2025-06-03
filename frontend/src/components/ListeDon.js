import { useEffect, useState, useContext } from "react";
import { fetchMesDons } from "../Services/donService";
import { AuthContext } from "../context/AuthContext";

const ListeDons = () => {
  const [mesDons, setMesDons] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      console.log("user non défini, on attend");
      return;
    }

    fetchMesDons()
      .then((data) => {
        console.log("Dons récupérés pour l'utilisateur :", data);
        setMesDons(data);
      })
      .catch((err) => console.error("Erreur chargement dons:", err));
  }, [user]); // dépendance : quand user est prêt

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mes Dons</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mesDons.map((don) => (
          <div key={don._id} className="border p-4 rounded shadow">
            {don.url_image?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-48 object-cover rounded mb-2"
              />
            ))}
            <h2 className="text-lg font-semibold">{don.titre}</h2>
            <p className="text-sm text-gray-600">{don.description}</p>
            <p className="text-xs text-gray-500">{don.ville_don}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeDons;
