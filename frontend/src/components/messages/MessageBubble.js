export default function MessageBubble({ sender, message }) {
    const isSender = sender === 'donateur';
    
    return (
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`px-4 py-2 rounded-lg max-w-xs ${isSender ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-black'}`}>
          {message}
        </div>
      </div>
    );
  }
  