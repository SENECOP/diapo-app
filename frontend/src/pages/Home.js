import Header from "../components/Header";
import CardDon from "../components/CardDon";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
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
        <Link to="/login">
          <button className="text-gray-700 hover:underline">Mon compte</button>
        </Link>
      </div>
        </div>
        <img src= '/assets/Charity-rafiki.png' alt="charity" className="md:w-1/3 w-full" />
      </section>

      {/* Sections de dons */}
      <section className="p-10">
        <h2 className="text-xl font-bold mb-4">Les nouveautés</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardDon />
          <CardDon />
          <CardDon />
          <CardDon />
        </div>

        <h2 className="text-xl font-bold mt-10 mb-4">Technologie</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardDon />
          <CardDon />
          <CardDon />
          <CardDon />
        </div>

        <h2 className="text-xl font-bold mt-10 mb-4">Vêtements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardDon />
          <CardDon />
          <CardDon />
          <CardDon />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
