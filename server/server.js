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
        socket.emit("Print", "connection successfull");
        socket.on("play", function(data) {
           //console.log("played ", data.index)
           let index = data.index;
           let bigIndex = data.bigIndex;
        //socket.broadcast.emit("play", {bigIndex:bigIndex, index:index})
        io.to(1).emit("play", {bigIndex:bigIndex, index:index});
        });
        socket.on("newGame", function(data) {
            
            let roomName = 1;//roomno++;
            rooms[socket.id] = roomName;
            moves[roomName] = [];

            socket.join(roomName);
            socket.number = 0;            
            socket.emit('gameCode', roomName)
            socket.emit("initialized", 0);
        });
        socket.on("joinGame", function(data) {            
            //socket.emit("Print", "join request recieved: " + data)
            
            rooms[socket.id] = roomName;

            socket.join(roomName);
            socket.number = 1;
            socket.emit("gameCode", roomName);
            socket.emit("initialized", 1);
            io.sockets.in(gameCode).emit("start", true);
        })
})

server.listen(process.env.PORT || 3000,() => {
    console.log('listening on *:3000');
});