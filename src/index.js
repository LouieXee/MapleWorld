import './index.less';

import 'pixi.js';

import Controller from './common/Controller';
import DisplayObject from './objects/DisplayObject';
import Ground from './map/Ground';

const { loader, Application, utils } = PIXI;

const TextureCache = utils.TextureCache;

loader
.add('ground.png')
.load(() => {
    const app = new Application({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const { renderer, view, ticker, stage } = app;

    renderer.autoResize = true;
    document.body.appendChild(view);

    let obj = new DisplayObject({
        x: 100,
        y: 200,
        width: 60,
        height: 100,
        debug: true
    });

    let ground = new Ground({
        x: 0,
        y: 500,
        size: 4,
        texture: TextureCache['ground.png']
    })

    new Controller(obj);

    stage.addChild(obj, ground);

    ticker.add(() => {
        obj.update();

        ground.check(obj)
    })

    renderer.render(stage);
})
