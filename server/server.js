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
        let index = 0;let bigIndex = 0;
        socket.on("play", function(data) {
           //io.to().emit("Print", "Play recieved");
           //console.log("played ", data.index)
           index = data.index;
           bigIndex = data.bigIndex;

           //moves[rooms[socket.id][]].size+1
        //socket.broadcast.emit("play", {bigIndex:bigIndex, index:index})
        io.to(rooms[socket.id]).emit("play", {bigIndex:bigIndex, index:index});        
        //io.to(roomName).emit("Print", "Play recieved");
        });
        socket.on("newGame", function(data) {
            
            //socket.emit("Print", socket.id)
            roomno++;
            let roomName = roomno.toString();
            rooms[socket.id] = roomName;
            moves[roomName] = [];
            //socket.join(roomName);

            //await 
            socket.join(roomName)
            io.to(roomName).emit("Print", "request recieved");
            //socket.emit("Print", socket.rooms)
            
            socket.number = 0;            
            socket.emit('gameCode', roomName)
        });
        socket.on("joinGame", function(data) {            
            //socket.emit("Print", "join request recieved: " + data)
            let roomName = data.toString();
            rooms[socket.id] = roomName;            
            socket.join(roomName);
            io.to(roomName).emit("Print", "Room joined");
            socket.number = 1;            
            //io.sockets.in(gameCode).emit("start", true);
            io.to(roomName).emit("start", true);
            socket.emit("gameCode", roomName)
        });
        socket.on("undoRequest", function(data) {
            io.to(rooms[socket.id]).emit("undoRequest");
        });
        socket.on("acceptUndoRequest", function(data) {
            io.to(rooms[socket.id]).emit("undo");
        })
})

server.listen(process.env.PORT || 3000,() => {
    console.log('listening on *:3000');
});