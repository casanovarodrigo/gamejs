import now from 'moment'
import { randomInt } from '../helpers/mathHelper'
import BaseObject from './BaseObject'

let lastID = 0
const createID = () => {
    const dateInMS = parseInt((new Date().getTime() / 1000).toString().replace('.', '')) // date with miliseconds
    if (lastID && dateInMS - lastID <= 1){
        lastID = dateInMS+1
        return lastID.toString()
    }
    lastID = dateInMS
    return dateInMS.toString()
}

export default class Player extends BaseObject {
    constructor(socketID){
        const dir = Math.random() * 2 * Math.PI
        const PLAYER_SPEED = 100
        const position = {
            x: randomInt(100,700),
            y: randomInt(100,500)
        }
        const id = createID()

        super(id, position, dir, PLAYER_SPEED)
        this.socketID = socketID
        this.created_at = now().utc().toDate()
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

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            socketID: this.socketID
        }
      }
}