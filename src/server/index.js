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
            const player = lobby.autoNewPlayer(socket)
            
            this.allPlayers[player.id] = player
            // emit all players only for new player
            socket.emit(eventType.ALL_PLAYERS, this.getAllPlayers())
            
            // broadcast new player location to all sockets except new player
            socket.broadcast.emit(eventType.NEW_PLAYER, player.serialize())

            // other socket events inside of newplayer event just for convenience - maybe have to change later
            // to-do then: create a function to return the player by socketID
            socket.on('click', (data) => {
                // console.log('click to '+data.x+', '+data.y)
                player.x = data.x
                player.y = data.y
                // that.io.emit(eventType.MOVEMENT, player.serialize())
            })
            
            socket.on(eventType.CLICK_EVENT, (data) => {
                const movedPlayer = lobby.movePlayer(player, data)
                this.allPlayers[player.id] = movedPlayer
            })

            socket.on(eventType.DISCONNECT, () => {
                console.log('saiu')
                delete that.sockets[socket.id]
                delete that.allPlayers[player.id]
                that.io.emit(eventType.REMOVE_PLAYER, player.id)
            })

            setInterval(this.update.bind(this), 10000 / 60)
        })
    }

    update(){
        // Calculate time elapsed
        const now = Date.now()
        const dt = (now - this.lastUpdateTime) / 1000
        this.lastUpdateTime = now

        // Send a game update to each player every other time
        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID]

                const lobby = LobbyManager.getInstance()
                const playerId = lobby.getPlayerIDFromSocketID(playerID)
                const player = this.allPlayers[playerId]
                
                const otherPlayersKeys = Object.keys(this.allPlayers).filter(id => id != playerId)
                const otherPlayers = {}
                otherPlayersKeys.forEach(key => {
                    Object.assign(otherPlayers, { [key]: this.allPlayers[key] })
                })
                const getUpdate = this.createUpdate(player, otherPlayers)
                socket.emit(eventType.SERVER_PACKET, getUpdate)
            })
            this.shouldSendUpdate = false
        } else {
            this.shouldSendUpdate = true
        }

    }

    createUpdate(player, otherPlayers) {
        const otherMap = Object.keys(otherPlayers).map(playerId => {
            return otherPlayers[playerId].serialize()
        })
        return {
            t: Date.now(),
            me: player.serialize(),
            others: otherMap
        }
    }

    getAllPlayers(){
        const all = []
        Object.keys(this.allPlayers).forEach(key => {
            all.push(this.allPlayers[key])
        })
        return all
    }


}