import Stats from 'stats.js';

import Store from './common/Store';
import Controller from './common/Controller';
import Player from './objects/Player';
import Ninja from './characters/Ninja';
import Map from './map/Map';

export default class Game {

    constructor (opt = {}) {
        const {
            app,
            mapConfig,
            debug = false,
            showTexture = true
        } = opt;

        const { stage, view } = app;

        this._app = app;
        this._mapConfig = mapConfig;
        this._debug = debug;
        this._showTexture = showTexture;

        this._player = this._createPlayer();
        this._currentMap = this._createMap(mapConfig);

        this._currentMap.addObject(this._player);
        stage.addChild(this._currentMap);

        Store.setViewSize(view.width, view.height);

        this._start();
    }

    _createPlayer () {
        let player = new Player({
            x: 100,
            y: 0,
            character: Ninja,
            name: 'player',
            type: 'player',
            tag: 'player',
            debug: this._debug
        });

        new Controller(player);

        return player
    }

    _createMap (mapConfig) {
        let map = new Map({
            debug: this._debug,
            showTexture: this._showTexture,
            ...mapConfig
        });

        return map;
    }

    _start () {
        const { ticker } = this._app;

        if (this._debug) {
            const stats = new Stats();
            document.body.appendChild(stats.dom);

            ticker.add(() => {
                stats.begin();

                this._currentMap.update();

                stats.end();
            })
        } else {
            ticker.add(() => {
                this._currentMap.update();
            })
        }
    }

}
