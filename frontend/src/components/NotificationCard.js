const NotificationCard = ({ notif }) => {
  return (
    <div className="bg-white rounded-md shadow p-4 mb-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">📦 Intérêt pour un Don</h4>
        <span className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleTimeString()}</span>
      </div>
      <p className="text-sm mt-2">{notif.emetteur.pseudo} a exprimé son intérêt pour votre don "{notif.don.titre}"</p>
      <div className="flex justify-end gap-2 mt-3">
        <button className="text-sm text-gray-500">Ignorer</button>
        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Voir</button>
      </div>
    </div>
  );
};
