import { useEffect, useState, useContext } from "react";
import { UserContext } from '../context/UserContext';
import Header from "../components/Header";
import axios from "axios";
import CardDon from "../components/CardDon";
import NotificationCard from '../components/NotificationCard';
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [dons, setDons] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données au montage
  useEffect(() => {
    if (user?.username) {
      toast.success(`Bienvenue ${user.username} !`, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://diapo-app.onrender.com/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log("Réponse de l'API pour les notifications:", res.data);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Erreur lors du chargement des notifications", err);
      }
    };

    const fetchDons = async () => {
      try {
        const res = await axios.get("https://diapo-app.onrender.com/api/dons");
        setDons(res.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des dons", err);
        setError("Impossible de charger les dons.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    fetchDons();
  }, [user]);
  console.log("Notifications:", notifications);


  const nouveautes = [...dons]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const Technologie = dons.filter(d => d.categorie?.toLowerCase() === "technologie");
  const Vetements = dons.filter(d => d.categorie?.toLowerCase() === "vêtements");
  const Meubles = dons.filter(d => d.categorie?.toLowerCase() === "meubles");

  return (
    <div>
      <Header />

      {/* Section Intro */}
      <section className="flex flex-col md:flex-row justify-between items-center bg-white p-10">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold mb-4">
            Donner et recevoir gratuitement des produits divers
          </h1>
          <p className="mb-4 text-gray-600">
            Dans un monde où le gaspillage est un enjeu majeur et où de nombreuses personnes sont dans le besoin, Diapo vise à créer un pont entre ceux qui veulent donner et ceux qui ont besoin de recevoir.
          </p>
          <div className="flex items-center gap-4">
            <Link to={user ? "/creer-don" : "/login"}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Faire un don
              </button>
            </Link>
          </div>
        </div>
        <img src="/assets/Charity-rafiki.png" alt="charity" className="md:w-1/3 w-full" />
      </section>

      {/* Section Notifications */}
      {notifications.length > 0 && (
        <section className="p-10">
          <div className="bg-yellow-100 p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-800">Dernières notifications</h2>
              <Link to="/notifications" className="text-blue-600 hover:underline text-sm">
                Voir tout
              </Link>
            </div>

            <div className="space-y-3">
              {notifications.slice(-3).reverse().map((notification) => (
                <NotificationCard key={notification._id} notification={notification} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Dons */}
      <section className="p-10">
        {loading && <p className="text-center text-gray-500">Chargement des dons...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {nouveautes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Les nouveautés</h2>
              <Link to="/dons/nouveautes" className="text-blue-600 hover:underline text-sm">
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {nouveautes.map(don => (
                <CardDon key={don._id} don={don} />
              ))}
            </div>
          </div>
        )}

        {Technologie.length > 0 && (
          <div>
            <div className="flex justify-between items-center mt-10 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Technologie</h2>
              <Link to="/dons/technologie" className="text-blue-600 hover:underline text-sm">
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Technologie.map(don => (
                <CardDon key={don._id} don={don} />
              ))}
            </div>
          </div>
        )}

        {Vetements.length > 0 && (
          <div>
            <div className="flex justify-between items-center mt-10 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Vêtements</h2>
              <Link to="/dons/vêtements" className="text-blue-600 hover:underline text-sm">
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Vetements.map(don => (
                <CardDon key={don._id} don={don} />
              ))}
            </div>
          </div>
        )}

        {Meubles.length > 0 && (
          <div>
            <div className="flex justify-between items-center mt-10 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Meubles</h2>
              <Link to="/dons/meubles" className="text-blue-600 hover:underline text-sm">
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Meubles.map(don => (
                <CardDon key={don._id} don={don} />
              ))}
            </div>
          </div>
        )}
      </section>

      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Dashboard;
