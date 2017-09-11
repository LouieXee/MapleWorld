import Store from '../../common/Store';

import Ground from '../Ground';
import Slope from '../Slope';
import Wall from '../Wall';

const { Container, Graphics } = PIXI;

export default class Map extends Container {

    constructor (opt = {}) {
        super();

        const {
            width = 0,
            height = 0,
            debug = false,
            showTexture = true,
            grounds = [],
            slopes = [],
            walls = []
        } = opt;

        this._width = width;
        this._height = height;

        this._bottomTiles = [];
        this._sideTiles = [];
        this._objects = [];
        this._player = null;

        this._debug = debug;
        this._showTexture = showTexture;

        this._createTiles(
            debug, showTexture, 
            grounds, slopes, 
            [...walls, {
                x: 0,
                y: 0,
                height,
                type: 'right'
            }, {
                x: width,
                y: 0,
                height,
                type: 'left'
            }]
        );
        this._locateMap();

        debug && this._setDebugMode();
    }

    _locateMap () {
        let viewSize = Store.getViewSize();

        if (viewSize.width > this._width) {
            this.x = (viewSize.width - this._width) / 2;
        }

        if (viewSize.height > this._height) {
            this.y = (viewSize.height - this._height) / 2;
        }
    }

    _setDebugMode () {
        let rectangle = new Graphics();

        rectangle.lineStyle(1, 0xFF0000, 1);
        rectangle.drawRect(0, 0, this._width, this._height);

        this.addChild(rectangle);
    }
    
    _createTiles (debug, showTexture, grounds, slopes, walls) {
        grounds = grounds.map(ground => (
            new Ground({
                ...ground,
                debug,
                showTexture 
            })
        ));
        slopes = slopes.map(slope => (
            new Slope({
                ...slope,
                debug,
                showTexture
            })
        ));
        walls = walls.map(wall => (
            new Wall({
                ...wall,
                debug,
                showTexture
            })
        ))

        this._bottomTiles = [...grounds, ...slopes];
        this._sideTiles = [...walls];
        this.addChild(...grounds, ...slopes, ...walls);
    }

    _followPlayer (player) {
        let viewSize = Store.getViewSize();

        if (viewSize.width - this._width < 0) {
            let expectedX = viewSize.width - player.position.x;

            expectedX > 0 && (expectedX = 0);
            expectedX < (viewSize.width - this._width) && (expectedX = viewSize.width - this._width);

            this.x = expectedX;
        }

        if (viewSize.height - this._height < 0) {
            let expectedY = viewSize.height - player.position.y;

            expectedY > 0 && (expectedY = 0);
            expectedY < (viewSize.height - this._height) && (expectedY = viewSize.height - this._height);

            this.y = expectedY;
        }
    }

    addObject () {
        let args = Array.prototype.slice.call(arguments, 0);

        this._objects.push(...args);
        this.addChild(...args)

        for (let obj of args) {
            if (obj.getName() == 'player') {
                this._player = obj;

                break;
            }
        }

        return this;
    }

    removeObject () {}

    update () {
        this._player && this._followPlayer(this._player);

        for (let obj of this._objects) {
            for (let sideTile of this._sideTiles) {
                if (sideTile.check(obj)) {
                    break;
                }
            }

            for (let bottomTile of this._bottomTiles) {
                if (bottomTile.check(obj)) {
                    break;
                }
            }

            obj.update();
        }
    }

}
