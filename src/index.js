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
// const SHOW_TEXTURE = true;
const SHOW_TEXTURE = false;

const MAP_CONFIG = {
    width: 1200,
    height: 800,
    grounds: [
        {
            x: 0,
            y: 700,
            size: 2,
            texture: 'ground.png'
        },
        {
            x: 360,
            y: 580,
            size: 2,
            texture: 'ground.png'
        },
        {
            x: 630,
            y: 640,
            size: 1,
            texture: 'ground.png'
        },
        {
            x: 683,
            y: 580,
            size: 3,
            edge: 'both',
            edgeTexture: 'edge.png',
            texture: 'ground.png'
        },
        {
            x: 990,
            y: 640,
            size: 3,
            texture: 'ground.png'
        },
        {
            x: 0,
            y: 500,
            size: 1,
            texture: 'ground.png'
        },
        {
            x: 180,
            y: 560,
            size: 1,
            edge: 'right',
            edgeTexture: 'edge.png',
            texture: 'ground.png'
        },
        {
            x: 400,
            y: 400,
            size: 0,
            edge: 'both',
            edgeTexture: 'edge.png',
            texture: 'ground.png'
        },
        {
            x: 500,
            y: 330,
            size: 0,
            edge: 'both',
            edgeTexture: 'edge.png',
            texture: 'ground.png'
        }
    ],
    slopes: [
        {
            x: 180,
            y: 580,
            size: 2,
            type: 'left',
            texture: 'slope-left.png'
        },
        {
            x: 540,
            y: 580,
            size: 1,
            type: 'right',
            texture: 'slope-right.png'
        },
        {
            x: 90,
            y: 500,
            size: 1,
            type: 'right',
            texture: 'slope-right.png'
        }
    ],
    walls: [
        {
            x: 720,
            y: 580,
            size: 1,
            type: 'left',
            texture: 'wall-left.png'
        },
        {
            x: 990,
            y: 580,
            size: 1,
            type: 'right',
            texture: 'wall-right.png'
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
        y: 120,
        character: new Ninja(),
        name: 'player',
        type: 'player',
        tag: 'team-a',
        debug: DEBUG
    });
    let robots = [];
    let map = new Map({
        debug: DEBUG,
        showTexture: SHOW_TEXTURE,
        ...MAP_CONFIG
    });

    new Controller(obj);

    for (let i = 0; i < 3; i++) {
        robots.push(new Robot({
            x: Math.random() * MAP_CONFIG.width,
            y: 200,
            character: new Snail(),
            name: `robot ${i}`,
            tag: 'team-b',
            debug: DEBUG,
        }))
    }

    map.addObject(...robots, obj);

    stage.addChild(map);

    ticker.add(() => {
        stats.begin();

        map.update();

        stats.end();
    })
})
