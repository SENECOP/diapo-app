import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FiSmile, FiPaperclip, FiSend } from 'react-icons/fi';

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Fichier sélectionné :', file);
      // Tu peux envoyer le fichier ici via Firebase ou autre
    }
  };

  const handleSend = () => {
    if (message.trim() === '') return;

    if (onSend) {
      onSend(message);
    } else {
      console.log('Message envoyé :', message);
    }

    setMessage('');
    setShowEmojiPicker(false);
  };

  return (
    <div className="w-full border-t bg-white p-4 flex items-center relative">
      {/* Bouton fichier */}
      <label className="cursor-pointer text-gray-500 hover:text-blue-600">
        <FiPaperclip size={20} />
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Champ texte */}
      <input
        type="text"
        className="flex-1 border mx-3 rounded-full px-4 py-2 focus:outline-none focus:ring"
        placeholder="Écrire un message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      {/* Emoji bouton */}
      <button
        className="text-gray-500 hover:text-yellow-500 mr-3"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <FiSmile size={22} />
      </button>

      {/* Bouton envoyer */}
      <button
        className="text-blue-600 hover:text-blue-800"
        onClick={handleSend}
      >
        <FiSend size={22} />
      </button>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-4 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}
