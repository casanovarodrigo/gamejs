import now from 'moment'
import { randomInt } from '../helpers/mathHelper'

export default class Player {
    constructor(){
        this.id = ''
        this.socketID = ''
        this.position = { x: 0, y: 0 }
        this.created_at = ''
        this.lastID = ''
    }

    init(socketID){
        const position = {
            x: randomInt(100,700),
            y: randomInt(100,500)
        }
        this.id = this.createID()
        this.created_at = now().utc().toDate()
        this.socketID = socketID
        this.position = position
        return this
    }

    serialize(){
        return {
            id: this.id,
            socketID: this.socketID,
            position: {
                x: this.position.x,
                y: this.position.y
            }
        }
    }


    createID(){
        const dateInMS = parseInt((new Date().getTime() / 1000).toString().replace('.', '')) // date with miliseconds
        if (this.lastID && dateInMS - this.lastID <= 1){
            this.lastID = dateInMS+1
            return this.lastID.toString()
        }
        this.lastID = dateInMS
        return dateInMS.toString()
    }
}