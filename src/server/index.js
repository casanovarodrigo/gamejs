import io from 'socket.io'

export default class gameServer {
    constructor(io) {
        this.io = io
        this.sockets = {}
        this.allPlayers = {}
        this.player = {}
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
        const that = this

        socket.on('newplayer', () => {

            const player = {
                id: this.lastUserID++,
                socketID: socket.id,
                x: this.randomInt(100,700),
                y: this.randomInt(100,500)
            }

            // create player class and export from here
            this.allPlayers[player.id] = player

            socket.emit('allplayers', this.getAllPlayers())
            socket.broadcast.emit('newplayer', player)


            socket.on('click', (data) => {
                console.log('click to '+data.x+', '+data.y);
                player.x = data.x;
                player.y = data.y;
                that.io.emit('movement', player);
            })

            socket.on('disconnect', () => {
                console.log('saiu')
                delete that.allPlayers[player.id]
                that.io.emit('removeplayers', player.id)
            })
        })


    }

    getAllPlayers(){
        const all = []
        Object.keys(this.allPlayers).forEach(key => {
            all.push(this.allPlayers[key])
        })
        return all
    }

    randomInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low)
    }


}