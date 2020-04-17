import now from 'moment'
import PlayerClass from './Player'

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
    
        getPlayerIDFromSocketID(socketId){
            return this.socketToPlayerMap.get(socketId)
        }

        movePlayer(player, data){
            console.log('click to '+data.x+', '+data.y)
            player.position.x = data.x
            player.position.y = data.y
            const currentRoom = this.rooms[this.getCurrentRoom()]
            currentRoom.players[player.id] = player
            return player
        }

        autoNewPlayer(socket){
            const newPlayer = new PlayerClass()
            const player = newPlayer.init(socket.id)
            if (this.addPlayerToRoom(this.getCurrentRoom(), player.serialize())){
                this.socketToPlayerMap.set(socket.id, player.id)
                return player
            }
            return false
        }
    
        addPlayerToRoom(roomId, player){
            const room = this.rooms[roomId] || null
            if (room){
                room.players[player.id] = player
                return roomId
            }
            return false
        }
    
        removePlayerFromRoom(roomId, player){
            const room = this.rooms[roomId] || null
            if (room){
                delete room.players[player.id]
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