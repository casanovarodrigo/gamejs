export default new class Client {
    constructor(){
        this.socket = io.connect()
    }

    askNewPlayer(){
        this.socket.emit('newplayer')
    }
    
    sendClick(x, y){
        this.socket.emit('click', { x, y})
    }
}