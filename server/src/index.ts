import WebSocket = require("ws");

const wss = new WebSocket.WebSocketServer({
    port: 8080,
});

wss.on("listening", () => {
    console.log("Web Socket server is up and running on port 8080");
});

interface User {
    socket: WebSocket;
    room: String;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);

        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }

        if (parsedMessage.type === "chat") {
            // let currentUserRoom = null;

            // for (let i = 0; i < allSockets.length; i++) {
            //     if (allSockets[i]?.socket === socket) {
            //         currentUserRoom = allSockets[i]?.room;
            //     }
            // }

            const currentUserRoom = allSockets.find((x) => x.socket === socket)?.room;
            
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i]?.room === currentUserRoom) {
                    allSockets[i]?.socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});