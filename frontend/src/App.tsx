import { useEffect, useRef, useState } from "react"

const App = () => {
  const [messages, setMessages] = useState(["New User Joined"])
  const wsRef = useRef<WebSocket>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    }

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type:  "join",
        payload: {
          roomId: "red"
        }
      }))
    }

    return () => {
      ws.close();
    }
  }, []);

  const handleSendMessage = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        payload: {
          message: inputRef.current?.value
        }
      }));
    }

    if (inputRef.current) inputRef.current.value = "";
  };
  
  return (
    <div className="h-screen w-full flex flex-col bg-black overflow-hidden">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, idx) => (
          <div key={idx} className="m-10"> 
            <span className="inline-block bg-white text-black rounded p-4"> 
              {message}
            </span> 
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar pinned to the bottom */}
      <div className="w-full bg-white flex shrink-0">
          <input 
            ref={inputRef} 
            type="text" 
            className="flex-1 p-4 text-black outline-none" 
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          
          <button 
            onClick={handleSendMessage} 
            className="bg-purple-600 text-white p-4 font-bold"
          >
            Send message
          </button>
      </div>
    </div>
  )
}

export default App
