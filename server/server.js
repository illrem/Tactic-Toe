const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: "https://tactictoe.co",
        methods: ["GET", "POST"]
    }
});

const { getMoves, addMove } = require('./game.js');
//const { makeid } = require('./utils.js');

const moves = {};
const rooms = {};
let roomno = 0;

io.on('connection', (socket)=> {
        //socket.emit("hello", "world");
        //socket.emit("Print", "connection successfull");
        socket.on("play", function(data) {
           //console.log("played ", data.index)
           let index = data.index;
           let bigIndex = data.bigIndex;
        //socket.broadcast.emit("play", {bigIndex:bigIndex, index:index})
        //io.to(roomName).emit("play", {bigIndex:bigIndex, index:index});        
        io.to(roomName).emit("Print", "Play recieved");
        });
        socket.on("newGame", function(data) {
            
            let roomName = 1;//roomno++;
            rooms[socket.id] = roomName;
            moves[roomName] = [];
            //socket.join(roomName);

            await socket.join(roomName)
            io.to(roomName).emit("Print", "request recieved");
            socket.emit("Print", socket.rooms)
            
            socket.number = 0;            
            socket.emit('gameCode', roomName)
        });
        socket.on("joinGame", function(data) {            
            //socket.emit("Print", "join request recieved: " + data)
            let roomName = data;
            rooms[socket.id] = roomName;

            socket.join(roomName);
            socket.number = 1;
            socket.emit("gameCode", roomName)
            io.sockets.in(gameCode).emit("start", true);
        })
})

server.listen(process.env.PORT || 3000,() => {
    console.log('listening on *:3000');
});