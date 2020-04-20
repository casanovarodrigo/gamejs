import CST from '../../helpers/CST'
export default (scene) => {
    const characters = CST.CHARACTERS
    
    characters.forEach(char => {
        scene.anims.create({
            key: "left",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers(char, {
                start: 9,
                end: 17
            })
        })

        scene.anims.create({
            key: "down",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers(char, {
                start: 18,
                end: 26
            })
        })

        scene.anims.create({
            key: "up",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers(char, {
                start: 0,
                end: 8
            })
        })

        scene.anims.create({
            key: "right",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers(char, {
                start: 27,
                end: 35
            })
        })
    })
}