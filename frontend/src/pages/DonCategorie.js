import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CardDon from '../components/CardDon'; 
const DonCategorie = () => {
  const { categorie } = useParams();
  const [dons, setDons] = useState([]);
  

  useEffect(() => {
    const fetchDons = async () => {
      try {
        const res = await axios.get(`https://diapo-app.onrender.com/api/dons/categorie/${categorie}`);
        setDons(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des dons :", err);
      }
    };

    fetchDons();
  }, [categorie]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">{capitalize(categorie)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dons.map((don) => (
            <CardDon key={don._id} don={don} />
          ))}
        </div>
    </div>
  );
};

export default DonCategorie;
