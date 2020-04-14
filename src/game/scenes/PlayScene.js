import { CST } from "../CST"
import { CharacterSprite } from "../CharacterSprite"
import { Sprite } from "../Sprite"
import Client from "../Client"

export class PlayScene extends Phaser.Scene {
    
    constructor() {
        super({
            key: CST.SCENES.PLAY,
        })
    }

    preload() {
        Client.askNewPlayer()
        
        Client.socket.on('newplayer', (data) => {
            console.log("outro usuário conectouuu", data)
        })

        Client.socket.on('allplayers', (data) => {
            console.log(data)
            data.forEach(player => {
                Game.addNewPlayer(player.id, player.x, player.y)
            })
        })

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

    create() {
        this.player = this.add.container(200, 200, [this.add.sprite(0, 0, "mandy", 26)]).setDepth(1).setScale(2)
        window.player = this.player
        
        
        this.anna = new CharacterSprite(this, 400, 300, "anna", 26)
        this.fireAttacks = this.physics.add.group()
        window.anna = this.anna

        //set smaller hitbox
        this.anna.setSize(40, 50).setOffset(10, 10)
        this.anna.setCollideWorldBounds(true)
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D")
        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown) { //is clicking
                let fire = this.add.sprite(pointer.worldX, pointer.worldY, "daze", "fire00.png").play("blaze")
                this.fireAttacks.add(fire)
                fire.on("animationcomplete", () => {
                    fire.destroy()
                })
            }
        })

        let mappy = this.add.tilemap("mappy")

        let terrain = mappy.addTilesetImage("terrain_atlas", "terrain")
        //layers
        let botLayer = mappy.createStaticLayer("bot", [terrain], 0, 0).setDepth(-1)
        let topLayer = mappy.createStaticLayer("top", [terrain], 0, 0)

        //map collisions
        this.physics.add.collider(this.anna, topLayer)
            //by tile property
        topLayer.setCollisionByProperty({collides:true})

            //by tile index
        topLayer.setCollision([269,270,271,301,302,303,333,334,335])



        this.input.on("gameobjectdown", (pointer, obj)=> {
            obj.destroy()
        })


        this.cameras.main.startFollow(this.anna)
        this.physics.world.setBounds(0,0, mappy.widthInPixels, mappy.heightInPixels)

        //draw debug render hitboxes
        topLayer.renderDebug(this.add.graphics(),{
            tileColor: null, //non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles,
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        })
    }
    update(time, delta) { //delta 16.666 @ 60fps

        const playerList = CST.GAME_STATE.playerList

        Client.socket.on('newplayer',function(data){
            Game.addNewPlayer(data.id, data.x, data.y)
        })

        if (this.anna.active === true) {
            if (this.keyboard.D.isDown === true) {
                this.anna.setVelocityX(128)

            }

            if (this.keyboard.W.isDown === true) {
                this.anna.setVelocityY(-128)
            }

            if (this.keyboard.S.isDown === true) {
                this.anna.setVelocityY(128)
            }

            if (this.keyboard.A.isDown === true) {
                this.anna.setVelocityX(-128)
            }
            if (this.keyboard.A.isUp && this.keyboard.D.isUp) { //not moving on X axis
                this.anna.setVelocityX(0)
            }
            if (this.keyboard.W.isUp && this.keyboard.S.isUp) { //not pressing y movement
                this.anna.setVelocityY(0)
            }

            if (this.anna.body.velocity.x > 0) { //moving right
                this.anna.play("right", true)
            } else if (this.anna.body.velocity.x < 0) { //moving left
                this.anna.anims.playReverse("left", true)
            } else if (this.anna.body.velocity.y < 0) { //moving up
                this.anna.play("up", true)
            } else if (this.anna.body.velocity.y > 0) { //moving down
                this.anna.play("down", true)
            }
        }

    }
}