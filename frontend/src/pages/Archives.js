import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Archives = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const res = await axios.get("https://diapo-app.onrender.com/api/dons/archives");
        setArchives(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des archives", err);
      } finally {
        setLoading(false);
      }
      
    };

    fetchArchives();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">Dons Archivés</h2>
        {loading ? (
          <p className="text-blue-600 animate-pulse">Chargement...</p>
        ) : archives.length === 0 ? (
          <p className="text-gray-600 italic">Aucun don archivé pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {archives.map((don) => (
              <div key={don._id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">{don.titre}</h3>
                <p className="text-sm text-gray-600">{don.description}</p>
                <p className="text-sm text-gray-500 italic">{don.ville_don}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Archives;
