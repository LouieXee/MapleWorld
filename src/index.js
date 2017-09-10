import './index.less';

import 'pixi.js';
import Stats from 'stats.js';

import Controller from './common/Controller';
import DisplayObject from './objects/DisplayObject';
import Character from './characters/Character';
import Ground from './map/Ground';
import Slope from './map/Slope';
import Wall from './map/Wall';

const { loader, Application, utils } = PIXI;

const { Sprite } = PIXI;

const TextureCache = utils.TextureCache;

const DEBUG = true;
const SHOW_TEXTURE = true;
// const SHOW_TEXTURE = false;

loader
.add('ground.png')
.add('slope-left.png')
.add('slope-right.png')
.add('wall-left.png')
.add('wall-right.png')
.add('background.png')
.load(() => {
    const app = new Application({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const { renderer, view, ticker, stage } = app;

    renderer.autoResize = true;
    document.body.appendChild(view);

    const stats = new Stats();
    document.body.appendChild(stats.dom)

    let obj = new DisplayObject({
        x: 50,
        y: 200,
        character: new Character(),
        debug: DEBUG
    });
    new Controller(obj);

    let textureGround = TextureCache['ground.png'];

    let verticalTiles = [
        new Ground({
            x: 0,
            y: 500,
            size: 2,
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: textureGround
        }),
        new Ground({
            x: 360,
            y: 380,
            size: 2,
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['ground.png']
        }),
        new Ground({
            x: 630,
            y: 440,
            size: 2,
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['ground.png']
        }),
        new Slope({
            x: 180,
            y: 381,
            size: 2,
            type: 'left',
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['slope-left.png']
        }),
        new Slope({
            x: 540,
            y: 381,
            size: 1,
            type: 'right',
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['slope-right.png']
        }),

        new Ground({
            x: 0,
            y: 300,
            size: 1,
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['ground.png']
        }),
        new Ground({
            x: 180,
            y: 360,
            size: 1,
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['ground.png']
        }),
        new Slope({
            x: 90,
            y: 301,
            size: 1,
            type: 'right',
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['slope-right.png']
        })
    ];

    let horizontalTiles = [
        new Wall({
            x: 10,
            y: 34,
            size: 4,
            type: 'right',
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['wall-right.png']
        }),
        new Wall({
            x: 10,
            y: 354,
            size: 2,
            type: 'right',
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['wall-right.png']
        }),
        new Wall({
            x: 800,
            y: 174,
            size: 4,
            type: 'left',
            debug: DEBUG,
            showTexture: SHOW_TEXTURE,
            texture: TextureCache['wall-left.png']
        })
    ];

    stage.addChild(...verticalTiles, ...horizontalTiles, obj);

    ticker.add(() => {
        stats.begin();

        obj.update();

        for (let horizontal of horizontalTiles) {
            if (horizontal.check(obj)) {
                break;
            }
        }

        for (let vertical of verticalTiles) {
            if (vertical.check(obj)) {
                break;
            }
        }

        stats.end();
    })
})
