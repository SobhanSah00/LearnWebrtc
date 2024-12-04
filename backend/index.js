import express from "express"
import {Server} from "socket.io"
import bodyParser from "body-parser"

const io = new Server(
    {
        cors: true
    }
)
const app = express()
app.use(bodyParser.json())

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on('connection',(socket) => {
    console.log("new Connection");
    socket.on('join-room',(data) => {
        console.log(data)
        const {roomId,email} = data;
        console.log(`a new client ${email} connected to roomId ${roomId}`)
        emailToSocketMapping.set(email,socket.id)
        socketToEmailMapping.set(socket.id,email)
        socket.join(roomId);
        console.log('user joined room',roomId)
        socket.emit("joined-room",{roomId})
        socket.broadcast.to(roomId).emit("user-joined", {email})

    })

    socket.on('offerForCall-User',(data) => {
        const {emailId,offer} = data;
        const fromEmail = socketToEmailMapping.get(socket.id)
        const socketId = emailToSocketMapping.get(emailId);
        if(socketId){
            socket.to(socketId).emit('incomming-call',{from : fromEmail,offer})
        }
    })

    socket.on('call-accepted', (data) => {
        const {}
    })
})

const port = 8000
app.listen(port,() => (
    console.log(`Server is running on port ${port}`)
))

io.listen(8001)