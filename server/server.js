const { Server } = require('socket.io');
const { useAzureSocketIO } = require('@azure/web-pubsub-socket.io');

const server = require('http').createServer()

const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    "http://localhost:8080"
].filter(Boolean)
console.log("CLIENT_ORIGIN env:", process.env.CLIENT_ORIGIN);
console.log("allowedOrigins:", allowedOrigins);

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            console.log("Socket.IO CORS check - origin:", origin);
            // Allow all origins (adapter will handle secure routing)
            callback(null, true);
        },
        methods: ["GET", "POST"],
        credentials: false,
        allowEIO3: true
    },
    transports: ['websocket', 'polling']
});
console.log("Socket.IO CORS config applied with wildcard");

const moves = {};
const rooms = {};
const roomTimer = [];
const roomMembers = {};
let roomno = 0;

io.on('connection', (socket)=> {
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
        socket.on("disconnect", function() {
            // free per-room state so memory doesn't grow unbounded (important on low-memory tiers)
            const roomName = rooms[socket.id];
            if (roomName) {
                delete moves[roomName];
                delete roomMembers[roomName];
                delete roomTimer[roomName];
            }
            delete rooms[socket.id];
        });
})

// negotiate/connect through Web PubSub instead of holding sockets directly, so the process can scale to zero
useAzureSocketIO(io, {
    hub: process.env.WEB_PUBSUB_HUB || 'Hub1',
    connectionString: process.env.WEB_PUBSUB_CONNECTION_STRING
}).then(() => {
    server.listen(process.env.PORT || 3000, () => {
        console.log('listening on *:3000 (with Azure Web PubSub adapter)');
    });
}).catch((err) => {
    console.error('Failed to connect to Azure Web PubSub for Socket.IO', err);
    process.exit(1);
});