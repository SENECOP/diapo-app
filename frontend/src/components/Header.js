import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiFilter, FiX, FiBell, FiMail, FiChevronDown } from "react-icons/fi";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationCard from "../components/NotificationCard";

const Header = () => {
  const { user } = useContext(UserContext);
  const {
    unreadMessages,
    setUnreadMessages,
    activeConversationId,
  } = useContext(MessageContext);

  const location = useLocation();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const filterMenuRef = useRef(null);

  const [showFilters, setShowFilters] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({ category: false, city: false });
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const token = localStorage.getItem("token");
  const don = location.state?.don || null;

  const tonMessageInitial = don && user ? {
    don_id: don._id,
    image: don.image_url,
    description: don.description,
    envoye_par: user.pseudo,
    recu_par: don.proprietaire?.pseudo ?? ""
  } : null;

  const categories = ["Technologie", "Vêtements", "Meuble"];
  const villes = ["Dakar", "Thiès", "Saint-Louis", "Mbour", "Yoff"];

  useEffect(() => {
    if (location.pathname === "/message") {
      setUnreadMessages(0);
    }
  }, [location.pathname, setUnreadMessages]);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch("https://diapo-app.onrender.com/api/messages/unread", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement des messages non lus");
        const data = await response.json();
        setUnreadMessages(data?.unreadCount || 0);
      } catch (error) {
        console.error("Erreur chargement messages :", error.message);
      }
    };

    const fetchUnreadNotifications = async () => {
      try {
        const response = await fetch("https://diapo-app.onrender.com/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erreur chargement notifications");
        const data = await response.json();
        const count = data.notifications?.filter(n => !n.vu).length || 0;
        setUnreadNotifications(count);
      } catch (err) {
        console.error("Erreur chargement notifs :", err.message);
      }
    };

    if (token) {
      fetchUnreadMessages();
      fetchUnreadNotifications();
    }
  }, [token, setUnreadMessages]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const socket = io("https://diapo-app.onrender.com", {
      transports: ["websocket", "polling"],
    });

    if (currentUser?.pseudo) {
      socket.emit("userConnected", currentUser.pseudo);
    }

    socketRef.current = socket;

    socket.on("receiveMessage", (message) => {
      if (message.recu_par === currentUser?.pseudo && message.don_id !== activeConversationId) {
        setUnreadMessages((prev) => prev + 1);
      }
    });

    socket.on("newNotification", (notif) => {
      setUnreadNotifications((prev) => prev + 1);

      toast.info(
        ({ closeToast }) => (
          <NotificationCard
            titre="Nouveau Don Réservé"
            message={notif.message}
            onVoir={() => {
              closeToast();
              navigate("/notifications");
            }}
            onIgnorer={closeToast}
          />
        ),
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [setUnreadMessages, activeConversationId, navigate]);

  const toggleDropdown = (type) => {
    setDropdownOpen((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSelection = (type, value) => {
    if (type === 'category') setSearchCategory(value);
    else setSearchCity(value);
    toggleDropdown(type);
  };

  const getInitials = (name) => {
    if (!name) return "XX";
    const parts = name.split(' ');
    return parts.length > 1
      ? parts[0][0] + parts[1][0]
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="bg-white shadow p-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img src="/logo_diapo.png" alt="Diapo Logo" className="h-16 w-auto" />
        </div>

        {/* Recherche + filtres */}
        <div className="flex items-center gap-2 flex-1 max-w-3xl mx-4 relative">
          <input
            type="text"
            placeholder="Ex: Pillow, iPhone cases, rugs"
            className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button onClick={() => setShowFilters(!showFilters)} className="p-2 border rounded hover:bg-gray-100">
            <FiFilter size={20} />
          </button>

          {showFilters && (
            <div ref={filterMenuRef} className="absolute right-0 mt-2 w-64 bg-white shadow-md border rounded p-4 z-10">
              {/* Catégorie */}
              <div className="mb-4 relative">
                <button
                  onClick={() => toggleDropdown('category')}
                  className="w-full flex justify-between items-center border px-4 py-2 rounded text-gray-700 hover:bg-gray-50"
                >
                  {searchCategory || "Catégorie"} <FiChevronDown />
                </button>
                {dropdownOpen.category && (
                  <ul className="absolute left-0 w-full mt-1 bg-white border rounded shadow z-20">
                    <li onClick={() => handleSelection('category', '')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Toutes</li>
                    {categories.map((cat) => (
                      <li key={cat} onClick={() => handleSelection('category', cat)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{cat}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Ville */}
              <div className="mb-4 relative">
                <button
                  onClick={() => toggleDropdown('city')}
                  className="w-full flex justify-between items-center border px-4 py-2 rounded text-gray-700 hover:bg-gray-50"
                >
                  {searchCity || "Ville"} <FiChevronDown />
                </button>
                {dropdownOpen.city && (
                  <ul className="absolute left-0 w-full mt-1 bg-white border rounded shadow z-20">
                    <li onClick={() => handleSelection('city', '')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Toutes</li>
                    {villes.map((ville) => (
                      <li key={ville} onClick={() => handleSelection('city', ville)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{ville}</li>
                    ))}
                  </ul>
                )}
              </div>

              <button onClick={() => setShowFilters(false)} className="absolute top-2 right-2 p-2 rounded-full text-gray-600 hover:text-gray-800">
                <FiX size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Notifications, messages, profil */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-blue-600">
            <FiBell size={22} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded-full">
                {unreadNotifications}
              </span>
            )}
          </Link>

          {/* Messages */}
          <button
            onClick={() =>
              navigate("/message", {
                state: { user, messageInitial: tonMessageInitial, don },
              })
            }
            className="relative p-2 text-gray-600 hover:text-blue-600"
          >
            <FiMail size={22} />
            {user && unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded-full">
                {unreadMessages}
              </span>
            )}
          </button>

          {/* Profil utilisateur */}
          {user && user.pseudo ? (
            <Link to="/profil" className="flex items-center gap-2 cursor-pointer">
              {user.avatar ? (
                <img src={user.avatar} alt={`Avatar de ${user.pseudo}`} className="w-8 h-8 rounded-full border object-cover" />
              ) : (
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                  {getInitials(user.pseudo)}
                </div>
              )}
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <button className="text-gray-700 hover:underline">Se connecter</button>
              </Link>
              <Link to="/signup">
                <button className="text-gray-700 hover:underline">S'inscrire</button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <ToastContainer />
    </>
  );
};

export default Header;
