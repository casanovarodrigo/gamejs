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

        setTargetPosition(player, data){
            const targetPosition = {
                x: data.x,
                y: data.y
            }
            // if player moved
            if (targetPosition.x !== player.position.x || targetPosition.y !== player.position.y){
                console.log('new movement')
                console.log('click to '+data.x+', '+data.y)
                console.log('pos '+data.dir)
                player.targetPosition.x = Math.max(0, Math.min(800, data.x));
                player.targetPosition.y = Math.max(0, Math.min(600, data.y));
                player.direction = data.dir
                const currentRoom = this.rooms[this.getCurrentRoom()]
                currentRoom.players[player.id] = player
            }
            
            return player
        }

        // movePlayer(player, data){
        //     const targetPosition = {
        //         x: data.x,
        //         y: data.y
        //     }
        //     const currentTarget = player.targetPosition
        //     // if player clicked to move
        //     if (targetPosition.x !== currentTarget.position.x || targetPosition.y !== currentTarget.position.y){
        //         // if player has to move
        //         if (currentTarget.position.x !== player.position.x || currentTarget.position.y !== player.position.y){
        //             player.update(dt)
        //         }
        //         console.log('new movement')
        //         console.log('click to '+data.x+', '+data.y)
        //         player.targetPosition.x = data.x
        //         player.targetPosition.y = data.y
        //         player.dir = data.pos
        //         const currentRoom = this.rooms[this.getCurrentRoom()]
        //         currentRoom.players[player.id] = player
        //     }
            
            
        //     return player
        // }

        autoNewPlayer(socket){
            // const newPlayer = new PlayerClass()
            const player = new PlayerClass(socket.id)
            console.log('player')
            console.log(player)
            // const player = newPlayer.init(socket.id)
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