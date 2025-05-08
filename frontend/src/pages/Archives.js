import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from "react-router-dom"; 


const MySwal = withReactContent(Swal);

const Archives = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const handleUnarchive = async (id) => {
    MySwal.fire({
      title: 'Désarchiver ce don ?',
      text: 'Ce don sera restauré dans la liste active.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Désarchiver',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'custom-archive-button',
        cancelButton: 'custom-cancel-button',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`https://diapo-app.onrender.com/api/dons/${id}/desarchiver`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
  
          MySwal.fire({
            title: 'Désarchivé',
            text: 'Don désarchivé avec succès !',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-archive-button'
            }
          });
  
          navigate("/ListeDons");
        } catch (err) {
          console.error("Erreur lors du désarchivage :", err);
          MySwal.fire({
            title: 'Erreur',
            text: 'Échec du désarchivage',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-cancel-button'
            }
          });
        }
      }
    });
  };
  

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("https://diapo-app.onrender.com/api/dons/archives", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        setArchives(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des dons archivés :", error);
        setArchives([]);
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
              <div key={don._id} className="border p-4 rounded-lg shadow-sm flex items-start space-x-4">
                {don.url_image && (
                  <img
                    src={`https://diapo-app.onrender.com/${don.url_image}`}
                    alt={don.titre || 'Image du don'}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{don.titre}</h3>
                  <p className="text-sm text-gray-600">{don.description}</p>
                  <p className="text-sm text-gray-500 italic">{don.ville_don}</p>
                  <button
                    onClick={() => handleUnarchive(don._id)}
                    className="mt-3 inline-block px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Désarchiver
                  </button>
                </div>
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
