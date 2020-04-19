import io from 'socket.io'

import LobbyManager from './Lobby'
import PlayerClass from './Player'
import eventType from '../helpers/eventTypes'

export default class gameServer {
    constructor(io) {
        this.io = io
        this.sockets = {}
        this.allPlayers = {}
        this.lastUpdateTime = Date.now()
        this.shouldSendUpdate = false
        this.lastUserID = 1
        // setInterval(this.update.bind(this), 1000 / 60)
    }

    listen(server){
        this.io = io.listen(server)
        this.io.on('connection', this.subscribeToEvents.bind(this))
    }

    getAllPlayersFromSocket(){
        const players = []
        Object.keys(this.io.sockets.connected).forEach((socketID) => {
            if(this.io.sockets.connected[socketID]){
                players.push(socketID)
            }
        })
        return players
    }

    subscribeToEvents(socket){ 
        // js trick referencing this
        const that = this
        const lobby = LobbyManager.getInstance()

        socket.on(eventType.ASK_ROOM, () => {
            socket.emit(eventType.ROOM_INFO, { lobby: lobby.id, room: lobby.getCurrentRoom() })
        })
        
        socket.on(eventType.NEW_PLAYER, () => {
            this.sockets[socket.id] = socket
            
            // new player from default lobby room
            const player = lobby.addPlayerToRoom(socket)
            

            // emit all players only for new player
            socket.emit(eventType.ALL_PLAYERS, lobby.getAllPlayersFromRoom())
            
            socket.broadcast.emit(eventType.NEW_PLAYER, player.serialize()) // broadcast new player location to all sockets except new player
            
            // other socket events inside of newplayer event just for convenience - maybe have to change later
            // to-do then: create a function to return the player by socketID
            setInterval(this.update.bind(this), 1000 / 60)
        })

        socket.on(eventType.CLICK_EVENT, (data) => {
            lobby.setPlayerTargetPosition(socket.id, data)
        })

        socket.on(eventType.DISCONNECT, () => {
            delete that.sockets[socket.id]
            lobby.removePlayerFromRoom(socket.id)
            that.io.emit(eventType.REMOVE_PLAYER, lobby.getPlayerIDBySocketID(socket.id))
        })
    }

    update(){
        // Calculate time elapsed
        const now = Date.now()
        const dt = (now - this.lastUpdateTime) / 1000
        this.lastUpdateTime = now

        console.log('dt: ', dt)

        // Send a game update to each player every other time
        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID]

                const lobby = LobbyManager.getInstance()
                const playerId = lobby.getPlayerIDBySocketID(playerID)
                const allPlayers = lobby.getAllPlayersFromRoom()
                const player = allPlayers[playerId]
                const updatedPlayer = lobby.updatePlayer(player, dt)
                
                const otherPlayersKeys = Object.keys(allPlayers).filter(id => id != playerId)
                const otherPlayers = {}
                otherPlayersKeys.forEach(key => {
                    Object.assign(otherPlayers, { [key]: allPlayers[key] })
                })
                const getUpdate = this.createUpdate(updatedPlayer, otherPlayers)
                socket.emit(eventType.SERVER_PACKET, getUpdate)
            })
            this.shouldSendUpdate = false
        } else {
            this.shouldSendUpdate = true
        }

    }

    createUpdate(player, otherPlayers) {
        const otherMap = Object.keys(otherPlayers).map(playerId => {
            return otherPlayers[playerId].serializeForUpdate()
        })
        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: otherMap
        }
    }

}