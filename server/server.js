const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: "https://tactictoe.co",
        methods: ["GET", "POST"]
    }
});

const { getMoves, addMove } = require('./game.js');
const { makeid } = require('./utils.js');

const moves = {};
const rooms = {};

io.on('connection', (socket)=> {
        //socket.emit("hello", "world");
        socket.on("play", function(data) {
           //console.log("played ", data.index)
           let index = data.index;
           let bigIndex = data.bigIndex;
        //socket.broadcast.emit("play", {bigIndex:bigIndex, index:index})
        io.sockets.in(1).emit("play", {bigIndex:bigIndex, index:index});
        });
        socket.on("newGame", function(data) {
            
            do{
                var roomName='';
                var char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charlength = charaters.length;
            
                for (var i = 0; i< length; i++)
                {
                    roomName += charaters.charAt(Math.floor(Math.random()* charlength));
                }
            }while(rooms.includes(roomName));

            rooms[socket.id] = roomName;
            socket.emit('gameCode', roomName)
            moves[roomName] = [];

            socket.join(roomName);
            socket.number = 0;
            socket.emit("initialized", 0);
        });
        socket.on("joinGame", function(data) {
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

            socket.join(gameCode)
            socket.number = 1;            
            socket.emit("initialized", 1);
        })
})

server.listen(process.env.PORT || 3000,() => {
    console.log('listening on *:3000');
});