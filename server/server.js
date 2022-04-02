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
const roomTimer = [];
const roomMembers = {};
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
        moves[rooms[socket.id]].push([bigIndex, index]);
        //socket.broadcast.emit("Print",moves[rooms[socket.id]][0]);
        //socket.broadcast.emit("Print",moves[rooms[socket.id]][moves[rooms[socket.id]][0]][0]);        
        //socket.broadcast.emit("Print",moves[rooms[socket.id]][moves[rooms[socket.id]][0]][1]);        
        moves[rooms[socket.id]][0] = moves[rooms[socket.id]][0] + 1;
        });
        socket.on("newGame", function(data) {
            
            //socket.emit("Print", socket.id)
            //socket.emit("Print", socket.id)
            roomno++;
            let roomName = roomno.toString();
            rooms[socket.id] = roomName;
            moves[roomName] = [1, "move 1"];
            moves[roomName].pop();
            //socket.join(roomName);
            roomMembers[roomName] = 1;
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
            
                if (roomMembers[roomName] == 1)
                {
                    if(rooms[socket.id] != roomName){//check player is not joining own lobby
                        roomMembers[roomName] = 2;
                        rooms[socket.id] = roomName;            
                        socket.join(roomName);
                        io.to(roomName).emit("Print", "Room joined");
                        socket.number = 1;            
                        //io.sockets.in(gameCode).emit("start", true);
                        io.to(roomName).emit("start", {start:true, timer:roomTimer[rooms[socket.id]]});            
                        //socket.emit("Print", moves[rooms[socket.id]][0]);
                        //socket.emit("Print", rooms.includes(roomName))            
                        socket.emit("gameCode", roomName)
                    }
                }
                else if (roomMembers[roomName] > 1)
                {
                    socket.join(roomName);
                    socket.emit("spectator", moves[roomName])
                }
        });
        socket.on("undoRequest", function(data) {
            io.to(rooms[socket.id]).emit("undoRequest");
        });
        socket.on("acceptUndoRequest", function(data) {
            io.to(rooms[socket.id]).emit("undo");
        });        
        socket.on("timer", function(data) {
            roomTimer[rooms[socket.id]] = data;
        });  
        socket.on("win", function(data) {
            let winner = data;
            io.to(rooms[socket.id]).emit("win", winner);
        })
})

server.listen(process.env.PORT || 3000,() => {
    console.log('listening on *:3000');
});