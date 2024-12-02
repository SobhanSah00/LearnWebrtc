import express from "express"
import {Server} from "socket.io"
import bodyParser from "body-parser"

const io = new Server()
const app = express()
app.use(bodyParser.json())

io.on('connection',(socket) => {
    console.log('a new client connected')
})

const port = 8000
app.listen(port,() => (
    console.log(`Server is running on port ${port}`)
))

io.listen(8001)