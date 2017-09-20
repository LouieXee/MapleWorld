import './index.less';

import 'pixi.js';

import Game from './Game';
import Store from './common/Store';

import Ninja from './characters/Ninja';
import Snail from './characters/Snail';

const { loader, Application } = PIXI;

const MAP_CONFIG = {
    width: 1200,
    height: 800,
    robots: [
        {
            character: 'Snail',
            x: 100,
            y: 0,
            robotType: 'radical',
            tag: 'monsters'
        },
        {
            character: 'Snail',
            x: 200,
            y: 0,
            robotType: 'cautious',
            tag: 'monsters'
        }
    ],
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

Store
.registerCharacter('Ninja', Ninja)
.registerCharacter('Snail', Snail)

loader
.add('ground.png', 'imgs/ground.png')
.add('edge.png', 'imgs/edge.png')
.add('slope-left.png', 'imgs/slope-left.png')
.add('slope-right.png', 'imgs/slope-right.png')
.add('wall-left.png', 'imgs/wall-left.png')
.add('wall-right.png', 'imgs/wall-right.png')
.add('background.png', 'imgs/background.png')
.add('imgs/snail.json')
.add('imgs/ninja.json')
.load(() => {
    const app = new Application({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const { renderer, view } = app;

    renderer.autoResize = true;
    document.body.appendChild(view);

    new Game({
        app,
        mapConfig: MAP_CONFIG,
        // debug: true,
        // showTexture: true
    })
})
