import { useEffect, useRef, useState } from "react"

const App = () => {
  const [messages, setMessages] = useState(["New User Joined"])
  const wsRef = useRef<WebSocket>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
  
  return (
    <div className="h-full bg-black">
      <br /> <br /> <br />
      <div className="h-[95vh]">
        {messages.map(message => <div className="m-10"> 
          <span className="bg-white text-black rounded p-4"> 
            {message}
          </span> 
        </div>)}
      </div>

      <div className="w-full bg-white flex">
          <input ref={inputRef} type="text" className="flex-1 p-4" />
          
          <button onClick={() => {
            if (wsRef.current) {
              wsRef.current.send(JSON.stringify({
                type: "chat",
                payload: {
                  message: inputRef.current?.value
                }
              }));
            }

            if (inputRef.current) inputRef.current.value = "";
          }} className="bg-purple-600 text-white p-4">
            Send message
          </button>
      </div>
    </div>
  )
}

export default App
