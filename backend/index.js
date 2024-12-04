// import express from "express"
// import {Server} from "socket.io"
// import bodyParser from "body-parser"

// const io = new Server({
//     cors: {
//         origin: "*", // Allow requests from any origin
//         methods: ["GET", "POST"], // Allow these HTTP methods
//     }
// });

// const app = express()
// app.use(bodyParser.json())

// const emailToSocketMapping = new Map();
// const socketToEmailMapping = new Map();

// io.on('connection',(socket) => {
//     console.log("new Connection");
//     socket.on('join-room',(data) => {
//         console.log(data)
//         const {roomId,email} = data;
//         console.log(`a new client ${email} connected to roomId ${roomId}`)
//         emailToSocketMapping.set(email,socket.id)
//         socketToEmailMapping.set(socket.id,email)
//         socket.join(roomId);
//         console.log('user joined room',roomId)
//         socket.emit("joined-room",{roomId})
//         socket.broadcast.to(roomId).emit("user-joined", {email})

//     })

//     socket.on('offerForCall-User',(data) => {
//         const {email,offer} = data;
//         const fromEmail = socketToEmailMapping.get(socket.id)
//         const socketId = emailToSocketMapping.get(email);
//         if(socketId){
//             socket.to(socketId).emit('incomming-call',{from : fromEmail,offer})
//         }
//     })

//     socket.on('call-accepted', (data) => {
//         const {email,ans} = data;
//         const socketId = emailToSocketMapping.get(email)
//         if(socketId){
//             // socket.to(socketId).emit('call-accepted',{from : socketToEmailMapping.get(socket)})
//             socket.to(socketId).emit('call-accepted',{ans})
//         }
//     })
// })

// const port = 8000
// app.listen(port,() => (
//     console.log(`Server is running on port ${port}`)
// ))

// io.listen(8001)

import express from "express";
import { Server } from "socket.io";

const app = express();
app.use(express.json()); // Replaces bodyParser

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

const httpServer = app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Replace with frontend domain for better security
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log("New connection");

    socket.on('join-room', (data) => {
        const { roomId, email } = data;
        console.log(`Client ${email} joined room ${roomId}`);
        emailToSocketMapping.set(email, socket.id);
        socketToEmailMapping.set(socket.id, email);
        socket.join(roomId);
        socket.emit("joined-room", { roomId });
        socket.broadcast.to(roomId).emit("user-joined", { email });
    });

    socket.on('offerForCall-User', (data) => {
        const { email, offer } = data;
        const fromEmail = socketToEmailMapping.get(socket.id);
        const socketId = emailToSocketMapping.get(email);
        if (socketId) {
            socket.to(socketId).emit('incoming-call', { from: fromEmail, offer });
        }
    });

    socket.on('call-accepted', (data) => {
        const { email, ans } = data;
        const socketId = emailToSocketMapping.get(email);
        if (socketId) {
            socket.to(socketId).emit('call-accepted', { ans });
        }
    });

    socket.on('disconnect', () => {
        const email = socketToEmailMapping.get(socket.id);
        if (email) {
            emailToSocketMapping.delete(email);
            socketToEmailMapping.delete(socket.id);
            console.log(`Client ${email} disconnected`);
        }
    });

    socket.on('error', (err) => {
        console.error(`Socket error: ${err.message}`);
    });
});
