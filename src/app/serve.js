import app  from './app'
import serveGame from '../server'

const port = process.env.PORT || 4000
const server = require('http').Server(app)
const listEndpoints = require('express-list-endpoints')

// list routes endpoins
// console.log(listEndpoints(app))

const gameServer = new serveGame
gameServer.listen(server)

server.listen(port, () => {
    console.log('app served on port:', `${process.env.HOST}:${port}`)
})