export default function ConversationList() {
    return (
      <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
  
        {/* Liste factice pour l'instant */}
        <ul>
          {[...Array(6)].map((_, i) => (
            <li key={i} className="p-2 border-b hover:bg-gray-100 cursor-pointer">
              <div className="font-semibold">Utilisateur {i + 1}</div>
              <div className="text-sm text-gray-500">Dernier message...</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  