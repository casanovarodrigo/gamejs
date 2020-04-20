import CST from "../../helpers/CST"

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }

    init() {

    }

    loadImages() {
        this.load.setPath("./public/assets/image")
        for (let prop in CST.IMAGE) {
            this.load.image(CST.IMAGE[prop], CST.IMAGE[prop])
        }
    }

    loadAudio() {
        this.load.setPath("./public/assets/audio")

        for (let prop in CST.AUDIO) {
            this.load.audio(CST.AUDIO[prop], CST.AUDIO[prop])
        }
    }

    loadSprites(frameConfig) {
        this.load.setPath("./public/assets/sprite")
        for (let prop in CST.SPRITE) {
            this.load.spritesheet(CST.SPRITE[prop], CST.SPRITE[prop], frameConfig)
        }
    }

    loadCharacters(){
        CST.CHARACTERS.forEach(char => {
            this.load.spritesheet(char, `./public/assets/sprite/${char}.png`, {frameHeight: 64, frameWidth: 64})
        })
    }
    
    preload() {
        this.loadCharacters()

        //load image, spritesheet, sound
        this.loadAudio()
        this.loadSprites({
            frameHeight: 32,
            frameWidth: 32
        })
        this.loadImages()

        //create loading bar

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        })

        /*
        Loader Events:
            complete - when done loading everything
            progress - loader number progress in decimal
        */

        //simulate large load
        
        // for(let i = 0; i < 100; i++){
        //     this.load.spritesheet("cat" + i, "./public/assets/cat.png", {
        //         frameHeight: 32,
        //         frameWidth: 32
        //     })        
        // }

        this.load.on("progress", (percent) => {
            loadingBar.fillRect(this.game.renderer.width / 2, 0, 50, this.game.renderer.height * percent)
            // console.log(percent)
        })

        this.load.on("complete", () => {
            //this.scene.start(CST.SCENES.MENU, "hello from LoadScene")
        })

        this.load.on("load", (file) => {
            // console.log(file.src)
        })
    }
    create() {

        this.scene.start(CST.SCENES.MENU)
    }
}