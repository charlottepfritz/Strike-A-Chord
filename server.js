var express = require('express');
var app = express();

var server = app.listen(3400);
app.use(express.static('Public'));

console.log("Server Running");

var socket = require('socket.io');
var io = socket(server);

var players = [];
var grid = [];
var grid2 = [];

function Point(x, y) {
    this.x = x;
    this.y = y;
}

for (i = 0; i < 50; i++) {
    var p = new Point(Math.random() * 4, Math.random() * -5000);
    grid.push(p);
}

for (j = 0; j < 50; j++) {
    var p2 = new Point(Math.random() * 4, Math.random() * -5000);
    grid2.push(p2);
}


class Player {
    constructor(id) {
        this.id = id;
        this.oppId = undefined;
    }
}

io.sockets.on('connection', function (socket) {

    socket.on('join', function () {

        if (players.length < 2) {
            var player = new Player(socket.id);
            players.push(player);

            if (players.length == 1) { //establish waiting room
                var imp = players.length;
                console.log("PLAYER 1 HAS JOINED :" + player.id);
                socket.broadcast.to(players[0].id).emit('waiting', { playerNum: 0, oppNum: 1, imp: players.length });
                socket.emit('waiting', { playerNum: 1, oppNum: 0, imp: players.length });
                io.emit("refreshnp", players);
            }

            else if (players.length === 2) {
                console.log("PLAYER 2 HAS JOINED :" + player.id);
                io.emit("refreshnp", players);
                io.emit("refreshGrid", grid);
                io.emit("refreshGrid2", grid2);
                players[0].oppId = players[1].id;
                players[1].oppId = players[0].id;
                getIndex(socket.id);
                socket.broadcast.to(players[0].id).emit('ready', { playerNum: 0, oppNum: 1 });
                socket.emit('ready', { playerNum: 1, oppNum: 0 });
            }
        }

    });

    socket.on('updatePoints', (pointData) => {
        if (players.length === 2) {
            var playerInd = getIndex(pointData.id);
            if (playerInd !== -1) {
                socket.broadcast.to(players[playerInd].oppId).emit("updatePointsAtLast", pointData);
            }
        }
    });
});


function getIndex(id) { //Get the player's position in the array
    return players.indexOf(players.find((player) => {
        return player.id === id
    }));
}
