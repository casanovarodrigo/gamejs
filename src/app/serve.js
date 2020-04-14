import app  from './app'
const port = process.env.PORT || 4000
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const listEndpoints = require('express-list-endpoints')

//app.use(cors({ origin: process.env.CORS_URL })) // CORS Whitelist

// list routes endpoins
// console.log(listEndpoints(app))

io.on('connection', (socket) => {


    socket.on('newplayer', () => {
        console.log('newplayerrr')
        socket.broadcast.emit('newplayer', '123213')
    })

})


server.listen(port, () => {
    console.log('app served on port:', `${process.env.HOST}:${port}`)
})