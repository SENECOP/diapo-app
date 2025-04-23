import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import CardDon from "../components/CardDon";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  const [dons, setDons] = useState([]);

  useEffect(() => {
    const fetchDons = async () => {
      try {
        const response = await axios.get("https://diapo-app.onrender.com/api/dons"); // adapte l'URL
        setDons(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des dons", error);
      }
    };

    fetchDons();
  }, []);

  const nouveautes = [...dons]
  .sort((a, b) => new Date(b.date) - new Date(a.date)) // tri par date décroissante
  .slice(0, 5); // prendre les 5 plus récents

  const Technologie = dons.filter(d => d.categorie?.toLowerCase() === "technologie");
  const Vêtements = dons.filter(d => d.categorie?.toLowerCase() === "vêtements");
  const Meubles = dons.filter(d => d.categorie?.toLowerCase() === "meubles");
  

  return (
    <div>
      <Header />

      {/* Section intro */}
      <section className="flex flex-col md:flex-row justify-between items-center bg-white p-10">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold mb-4">
            Donner et recevoir gratuitement des produits divers
          </h1>
          <p className="mb-4 text-gray-600">
            Dans un monde où le gaspillage est un enjeu majeur et où de nombreuses personnes sont dans le besoin, Diapo vise à créer un pont entre ceux qui veulent donner et ceux qui ont besoin de recevoir
          </p>
          <div className="flex items-center gap-4">
            <Link to="/Login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Faire un don
              </button>
            </Link>

            
            <Link to="/ListeDons" className="text-blue-600 hover:underline">
           Aller à la liste des dons
          </Link>
          </div>
        </div>
        <img src="/assets/Charity-rafiki.png" alt="charity" className="md:w-1/3 w-full" />
      </section>

      {/* Sections de dons */}
      <section className="p-10">
        {/* Nouveautés */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800" >Les nouveautés</h2>
          <Link to={`/dons/${encodeURIComponent("nouveautes")}`} className="text-blue-600 hover:underline text-sm">
           Voir tout
          </Link>

        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nouveautes.map(don => (
          <CardDon key={don._id} don={don} />
        ))}
        </div>

        {/* Technologie */}
        <div className="flex justify-between items-center mt-10 mb-4">
          <h2 className="text-xl font-bold  text-gray-800">Technologie</h2>
          <Link to={`/dons/${encodeURIComponent("Technologie")}`} className="text-blue-600 hover:underline text-sm">
            Voir tout
          </Link>

        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Technologie.map(don => (
          <CardDon key={don._id} don={don} />
        ))}
        
        </div>

        {/* Vêtements */}
        <div className="flex justify-between items-center mt-10 mb-4">
          <h2 className="text-xl font-bold  text-gray-800">Vêtements</h2>
          <Link to={`dons/${encodeURIComponent("vêtements")}`} className="text-blue-600 hover:underline text-sm">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Vêtements.map(don => (
          <CardDon key={don._id} don={don} />
        ))}
          
        </div>
        <div className="flex justify-between items-center mt-10 mb-4">
          <h2 className="text-xl font-bold  text-gray-800">Meubles</h2>
          <Link to={`/dons/${encodeURIComponent("meubles")}`} className="text-blue-600 hover:underline text-sm">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Meubles.map(don => (
          <CardDon key={don._id} don={don} />
        ))}
          
        </div>
      </section>
     

      <Footer />
    </div>
  );
};

export default Home;
