import now from 'moment'
import PlayerClass from './Player'
import CST from '../helpers/CST'

export default (() => {
    class Lobby {
        constructor(){
            this.id = ''
            this.created_at = ''
            this.rooms = {
                // roomID: {
                //     players:
                // }
            }
            this.lastID = ''
            this.socketToPlayerMap = new Map()
        }
    
        init(){
            this.id = this.createID()
            this.created_at = now().utc().toDate()
            this.createRoom()
        }
    
        createRoom(playersToAdd){
            const players = playersToAdd || {}
            const roomId = this.createID()
            const newRoom = {
                map: 'normal',
                created_at: now().utc().toDate(),
                players: players
            }
            this.rooms[roomId] = newRoom
            return roomId
        }
    
        getCurrentRoom(){
            return Object.keys(this.rooms)[0]
        }
    
        getPlayerIDBySocketID(socketId){
            return this.socketToPlayerMap.get(socketId)
        }

        getPlayerBySocketID(socketID){
            const playerId = this.getPlayerIDBySocketID(socketID)
            const allPlayers = this.getAllPlayersFromRoom()
            return allPlayers[playerId] || null
        }
        
        getAllPlayersFromRoom(){
            const roomId = this.getCurrentRoom()
            const room = this.rooms[roomId]
            return room? room.players : null
        }

        setPlayerTargetPosition(socketId, data){
            const player = this.getPlayerBySocketID(socketId)
            const targetPosition = {
                x: data.x,
                y: data.y
            }
            // if player moved
            if (targetPosition.x !== player.position.x || targetPosition.y !== player.position.y){
                console.log('new movement')
                console.log('click to '+data.x+', '+data.y)
                console.log('direction '+data.dir)
                player.targetPosition.x = Math.max(0, Math.min(CST.WORLD_WIDTH, data.x));
                player.targetPosition.y = Math.max(0, Math.min(CST.WORLD_HEIGHT, data.y));
                player.direction = data.dir
                this.updatePlayer(player)
            }
            
            return player
        }

        updatePlayer(player){
            const roomId = this.getCurrentRoom()
            const room = this.rooms[roomId]
            if (room.players && room.players[player.id]){
                room.players[player.id] = player
            }
        }
    
        addPlayerToRoom(socket){
            const roomId = this.getCurrentRoom()
            const room = this.rooms[roomId] || null
            if (room){
                const player = new PlayerClass(socket.id)
                room.players[player.id] = player
                this.socketToPlayerMap.set(socket.id, player.id)
                return player
            }
            return false
        }
    
        removePlayerFromRoom(socketId){
            const playerId = this.getPlayerIDBySocketID(socketId)
            const roomId = this.getCurrentRoom()
            const room = this.rooms[roomId] || null
            
            if (room){
                delete room.players[playerId]
                return room.id
            }
            return false
        }
    
        createID(){
            const dateInMS = parseInt((new Date().getTime() / 1000).toString().replace('.', '')) // date with miliseconds
            if (this.lastID && dateInMS - this.lastID <= 1){
                this.lastID = parseInt(dateInMS)+1
                return this.lastID.toString()
            }
            this.lastID = dateInMS
            return dateInMS.toString()
        }
    }
    
    var instance
    return {
        getInstance: () => {
            // check if instance is available
            if (!instance) {
                instance = new Lobby()
                instance.init()
                delete instance.constructor // or set it to null
            }
            return instance
        }
    }
})()