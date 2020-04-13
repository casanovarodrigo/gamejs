require('./bootstrap');


import { LoadScene } from "./scenes/LoadScene";
import { MenuScene } from "./scenes/MenuScene";
import { PlayScene } from "./scenes/PlayScene";
let game = new Phaser.Game({
    width: 800,
    height: 600,
    parent: 'gameEl',
    scene: [
        LoadScene, MenuScene, PlayScene
    ],
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    }
});