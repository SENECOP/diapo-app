export default function MessageBubble({ sender, message, files = [] }) {
  const isSender = sender === 'preneur';
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`px-4 py-2 rounded-lg max-w-xs 
        ${isSender ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-black'}`}>
        <div className="whitespace-pre-wrap">{message}</div>

        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((f, i) => (
              <div key={i}>
                {f.url
                  ? <img src={f.url} alt="" className="max-w-full rounded" />
                  : <a 
                      href={URL.createObjectURL(f.file)} 
                      download={f.file.name}
                      className="underline"
                    >
                      {f.file.name}
                    </a>
                }
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
