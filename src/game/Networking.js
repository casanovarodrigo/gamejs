import eventType from '../helpers/eventTypes'
import { processGameUpdate } from './State'

export default new class Networking {
    constructor(){
        this.socket = {}
        this.roomInfo = { lobby: '', room: '' }
    }

    connectedPromise(){
        return new Promise(resolve => {
            this.socket.on('connect', () => {
                console.log('Connected to server!')
                resolve()
            })
        })
    }

    connect(scene){
        this.socket = io.connect()
        const promise = this.connectedPromise()
        promise.then(() => {

            this.askNewRoom()

            this.socket.on(eventType.ROOM_INFO, (roomInfo) => {
                this.updateRoomInfo(roomInfo)
                this.askNewPlayer()
            })
        
            this.socket.on(eventType.SERVER_PACKET, (packet) => {
                // console.log('server PACKET', packet)
                processGameUpdate(packet);
                // scene.addPlayers(packet.me)
                // scene.addPlayers(packet.others)
                // console.log('server PACKET me', packet.me)
                // console.log('server PACKET others', packet.others)

            })

            this.socket.on(eventType.NEW_PLAYER, (player) => {
                scene.addPlayers(player)
            })

            this.socket.on(eventType.ALL_PLAYERS, (playerList) => {
                scene.addPlayers(playerList)
            })

            this.socket.on(eventType.REMOVE_PLAYER, (playerId) => {
                console.log("player saiu")
                scene.removePlayer(playerId)
            })
        })
    }

    askNewPlayer(){
        this.socket.emit(eventType.NEW_PLAYER)
    }

    askNewRoom(){
        this.socket.emit(eventType.ASK_ROOM)
    }
    
    updateRoomInfo(roomInfo){
        this.roomInfo.lobby = roomInfo.lobby
        this.roomInfo.room = roomInfo.room
    }

    clickEvent(x, y, dir){
        this.socket.emit(eventType.CLICK_EVENT, { x, y, dir })
    }

    getSocketID(){
        return this.socket.id
    }
    
    // sendClick(x, y){
    //     this.socket.emit(eventType.CLICK_EVENT, { x, y })
    // }
    
    
}