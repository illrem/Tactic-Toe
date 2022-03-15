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
            socket.emit('gameCode', roomName)
            moves[roomName] = [];

            socket.join(roomName);
            socket.number = 0;
            socket.emit("initialized", 0);
        });
        socket.on("joinGame", function(data) {            
            socket.emit("Print", "join request recieved");
            gameCode = data;
            const room = io.sockets.adapter.rooms[gameCode];//grab the current room

            let allUsers;
            if (room) {
                allUsers = room.sockets;
            }
            
            let clients = 0;
            if (allUsers) {
                clients = object.keys(allUsers).length;

                if (clients < 1)
                {
                    socket.emit('fail');
                    return;
                }
                else if (clients > 1)
                {
                    socket.emit('spectator');// add spectator handling
                    return;
                }
            }
            else {
                socket.emit('fail');
                return;
            }

            rooms[socket.id] = gameCode;

            socket.join(gameCode);
            socket.number = 1;
            socket.emit('gameCode', roomName);
            socket.emit("initialized", 1);
            io.sockets.in(gameCode).emit("start", true);
        })
})

server.listen(process.env.PORT || 3000,() => {
    console.log('listening on *:3000');
});