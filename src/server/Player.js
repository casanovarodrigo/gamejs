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
        const PLAYER_SPEED = 15
        const position = {
            x: randomInt(100,700),
            y: randomInt(100,500)
        }
        const id = createID()

        super(id, position, PLAYER_SPEED)
        this.socketID = socketID
        this.created_at = now().utc().toDate()
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            socketID: this.socketID
        }
      }
}