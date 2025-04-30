import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

export default function MessageBox() {
  return (
    <div className="flex flex-col w-2/3">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Messages */}
        <MessageBubble sender="donateur" message="Voici l'image du don, vous êtes intéressé ?" />
        <MessageBubble sender="interesse" message="Oui je suis intéressé, merci !" />
      </div>

      {/* Input pour envoyer un message */}
      <MessageInput />
    </div>
  );
}
