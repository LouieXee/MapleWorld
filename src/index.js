import './index.less';

import 'pixi.js';
import Stats from 'stats.js';

import Store from './common/Store';
import Controller from './common/Controller';
import DisplayObject from './objects/DisplayObject';
import Robot from './objects/Robot';
import Snail from './characters/Snail';
import Ninja from './characters/Ninja';
import Map from './map/Map';

const { loader, Application, utils, Container } = PIXI;

const { Sprite } = PIXI;

const TextureCache = utils.TextureCache;

const DEBUG = true;
const SHOW_TEXTURE = true;
// const SHOW_TEXTURE = false;

const MAP_CONFIG = {
    width: 800,
    height: 600,
    grounds: [
        {
            x: 0,
            y: 500,
            size: 2,
            texture: 'ground.png'
        },
        {
            x: 360,
            y: 380,
            size: 2,
            texture: 'ground.png'
        },
        {
            x: 630,
            y: 440,
            size: 1,
            texture: 'ground.png'
        },
        {
            x: 683,
            y: 380,
            size: 1,
            edge: 'left',
            edgeTexture: 'edge.png',
            texture: 'ground.png'
        },
        {
            x: 0,
            y: 300,
            size: 1,
            texture: 'ground.png'
        },
        {
            x: 180,
            y: 360,
            size: 1,
            edge: 'right',
            edgeTexture: 'edge.png',
            texture: 'ground.png'
        },
        {
            x: 400,
            y: 200,
            size: 0,
            edge: 'both',
            edgeTexture: 'edge.png',
            texture: 'ground.png'
        }
    ],
    slopes: [
        {
            x: 180,
            y: 380,
            size: 2,
            type: 'left',
            texture: 'slope-left.png'
        },
        {
            x: 540,
            y: 380,
            size: 1,
            type: 'right',
            texture: 'slope-right.png'
        },
        {
            x: 90,
            y: 300,
            size: 1,
            type: 'right',
            texture: 'slope-right.png'
        }
    ],
    walls: [
        {
            x: 720,
            y: 380,
            size: 1,
            type: 'left',
            texture: 'wall-left.png'
        }
    ]
};

loader
.add('ground.png')
.add('edge.png')
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

    Store.setViewSize(view.width, view.height);

    let obj = new DisplayObject({
        x: 435,
        y: 100,
        character: new Ninja(),
        id: 'player',
        name: 'player',
        debug: DEBUG
    });
    let robots = [1, 2].map(i => 
        new Robot({
            x: Math.random() * MAP_CONFIG.width,
            y: 200,
            character: new Snail(),
            debug: DEBUG,
            name: `robot ${i}`
        })
    )

    let map = new Map({
        debug: DEBUG,
        showTexture: SHOW_TEXTURE,
        ...MAP_CONFIG
    });

    new Controller(obj);

    map.addObject(...robots, obj);

    stage.addChild(map);

    ticker.add(() => {
        stats.begin();

        map.update();

        stats.end();
    })
})
