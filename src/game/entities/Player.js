import CharacterSprite from './CharacterSprite'
import Networking from '../helpers/Networking'

export default class Player extends CharacterSprite {
    constructor(player, scene){
        const pX = player.position? player.position.x : player.x
        const pY = player.position? player.position.y : player.y
        const texture = ("anna")
        const frame = 26

        super(scene, pX, pY, texture, frame)

        this.setSize(40, 50).setOffset(10, 10)
        this.setCollideWorldBounds(true)
        this.socketID = Networking.getSocketID()
        this.dir = player.dir
        this.setInteractive()
    }

}