import { CST } from "../CST"
import { CharacterSprite } from "../CharacterSprite"
import { Sprite } from "../Sprite"
import Networking from "../Networking"
import eventType from '../../helpers/eventTypes'

import { getCurrentState } from '../State';

export class PlayScene extends Phaser.Scene {
    
    constructor() {
        super({
            key: CST.SCENES.PLAY,
        })
        this.playerMap = {}
    }

    preload() {
        Networking.connect(this)


        this.anims.create({
            key: "left",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 9,
                end: 17
            })
        })

        this.anims.create({
            key: "down",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 18,
                end: 26
            })
        })

        this.anims.create({
            key: "up",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 0,
                end: 8
            })
        })

        this.anims.create({
            key: "right",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 27,
                end: 35
            })
        })

        this.anims.create({
            key: "blaze",
            duration: 50,
            frames: this.anims.generateFrameNames("daze", {
                prefix: "fire0",
                suffix: ".png",
                end: 55
            }),
            showOnStart: true,
            hideOnComplete: true
        })

        this.textures.addSpriteSheetFromAtlas("mandy", { frameHeight: 64, frameWidth: 64, atlas: "characters", frame: "mandy" })

        this.load.image("terrain", "./public/assets/image/terrain_atlas.png")
        this.load.image("items", "./public/assets/image/items.png")

        this.load.tilemapTiledJSON("mappy", "./public/assets/maps/mappy.json")

    }

    addPlayers(playerList){
        const players = {};
        if(playerList && !Array.isArray(playerList)){
            playerList = [playerList]
        }
        playerList.forEach(player => {
            const pX = player.position? player.position.x : player.x
            const pY = player.position? player.position.y : player.y
            players[player.id] = new CharacterSprite(this, pX, pY, ("anna"), 26)
            players[player.id].setSize(40, 50).setOffset(10, 10)
            players[player.id].setCollideWorldBounds(true)
        })
        this.playerMap = Object.assign({}, this.playerMap, players)
    }

    removePlayer(playerId){
        this.playerMap[playerId].destroy()
        delete this.playerMap[playerId]
    }
    
    moveClick(worldX, worldY){
        Networking.sendClick(worldX, worldY)
    }
    
    movePlayer(id, position){
        let player = this.playerMap[id]
        let distance = Phaser.Math.Between(player.x, player.y, position.x, position.y)
        let duration = distance * 4
        // #1 Bug - distance traveled
        // console.log(distance, duration)
        this.tweens.add({
            targets: player,
            x: position.x,
            y: position.y,
            duration: duration,
            ease: 'elastic',
            delay: 20
        })
    }

    create() {
        this.player = this.add.container(200, 200, [this.add.sprite(0, 0, "mandy", 26)]).setDepth(1).setScale(2)
        window.player = this.player
        
        // this.keyboard = this.input.keyboard.addKeys("W, A, S, D")

        
        this.input.on("pointerdown", (pointer) => {
            this.moveClick(pointer.worldX, pointer.worldY)
        })


        let mappy = this.add.tilemap("mappy")

        let terrain = mappy.addTilesetImage("terrain_atlas", "terrain")
        //layers
        let botLayer = mappy.createStaticLayer("bot", [terrain], 0, 0).setDepth(-1)
        let topLayer = mappy.createStaticLayer("top", [terrain], 0, 0)


        //by tile property
        topLayer.setCollisionByProperty({collides:true})

        //by tile index
        topLayer.setCollision([269,270,271,301,302,303,333,334,335])

        this.physics.world.setBounds(0,0, mappy.widthInPixels, mappy.heightInPixels)

        //draw debug render hitboxes
        topLayer.renderDebug(this.add.graphics(),{
            tileColor: null, //non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles,
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        })
    }

    update(time, delta) { //delta 16.666 @ 60fps

        const { me, others } = getCurrentState()

        if (!me){
            return;
        }

        // move player
        this.movePlayer(me.id, me.position)
        // move others
        others.forEach(otherPlayer => {
            this.movePlayer(otherPlayer.id, otherPlayer.position)
        })



        // console.log('me', 'others')
        // console.log(me, others)

        const playerList = CST.GAME_STATE.playerList


    }
}