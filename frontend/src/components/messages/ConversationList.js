import { useNavigate } from "react-router-dom";

export default function ConversationList({ conversations = [] }) {
  const navigate = useNavigate();

  return (
    <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>

      <ul>
        {conversations.length === 0 ? (
          <p className="text-gray-500">Aucune conversation</p>
        ) : (
          conversations.map((conv) => (
            <li
              key={conv._id}
              className="p-2 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                navigate("/message", {
                  state: {
                    user: {
                      pseudo: conv.pseudo || "Preneur inconnu",
                      avatar: conv.avatar || "https://via.placeholder.com/50",
                    },
                    messageInitial: conv.messageInitial || null,
                  },
                });
              }}
            >
              <div className="font-semibold">
                {conv.pseudo || "Preneur inconnu"}
              </div>
              <div className="text-sm text-gray-500">
                {conv.dernierMessage || "Aucun message"}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
