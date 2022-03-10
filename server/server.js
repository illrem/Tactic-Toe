const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket)=> {
        socket.emit("hello", "world");
        socket.on("play", (bigIndex, index) => {
           //console.log("played ", index)
        socket.broadcast.emit("play", (bigIndex, index))
        })
})

server.listen(3000)