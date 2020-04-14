import app  from './app'
const port = process.env.PORT || 4000
const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const listEndpoints = require('express-list-endpoints')

//app.use(cors({ origin: process.env.CORS_URL })) // CORS Whitelist

// list routes endpoins
// console.log(listEndpoints(app))

server.lastPlayderID = 0

io.on('connection', (socket) => {

    socket.on('newplayer', () => {
        const player = {
            id: server.lastPlayderID++,
            x: randomInt(100,700),
            y: randomInt(100,500)
        }
        socket.player = player
        socket.emit('allplayers', getAllPlayers())
        socket.broadcast.emit('newplayer', socket.player)

        socket.on('disconnect', () => {
            console.log('saiu')
            io.emit('removeplayers', socket.player.id)
        })
    })

})

function getAllPlayers(){
    var players = []
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player
        if(player) players.push(player)
    })
    return players
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}


server.listen(port, () => {
    console.log('app served on port:', `${process.env.HOST}:${port}`)
})