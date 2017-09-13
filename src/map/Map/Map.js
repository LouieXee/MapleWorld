import Store from '../../common/Store';
import { isFunction } from '../../utils';

import Robot from '../../objects/Robot';

import Ground from '../Ground';
import Slope from '../Slope';
import Wall from '../Wall';
import Ceiling from '../Ceiling';

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
            walls = [],
            ceilings = [],
            robots = []
        } = opt;

        this._width = width;
        this._height = height;

        this._verticalTiles = [];
        this._horizantolTiles = [];
        this._objects = [];
        this._player = null;

        this._debug = debug;
        this._showTexture = showTexture;

        this._createTiles({
            grounds,
            slopes,
            walls: [
                ...walls, 
                {
                    x: 0,
                    y: 0,
                    height,
                    type: 'right'
                }, 
                {
                    x: width,
                    y: 0,
                    height,
                    type: 'left'
                }
            ],
            ceilings: [
                ...ceilings,
                {
                    x: 0,
                    y: 0,
                    width
                }
            ]
        });
        this._createRobots(robots);
        this._locateMap();

        debug && this._setDebugMode();
    }

    _setDebugMode () {
        let rectangle = new Graphics();

        rectangle.lineStyle(1, 0xFF0000, 1);
        rectangle.drawRect(0, 0, this._width, this._height);

        this.addChild(rectangle);
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
    
    _createTiles ({ grounds, slopes, walls, ceilings }) {
        let debug = this._debug;
        let showTexture = this._showTexture;

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
        ceilings = ceilings.map(ceiling => (
            new Ceiling({
                ...ceiling,
                debug,
                showTexture
            })
        ))

        this._verticalTiles = [...grounds, ...slopes, ...ceilings];
        this._horizantolTiles = [...walls];
        this.addChild(...grounds, ...slopes, ...walls, ...ceilings);
    }

    _createRobots (robots) {
        let debug = this._debug;
        let showTexture = this._showTexture;
        let robotInstances = [];

        for (let robot of robots) {
            let characterCreater = Store.getCharacter(robot.character);

            if (!characterCreater) {
                continue;
            }

            robotInstances.push(
                new Robot({
                    ...robot,
                    debug,
                    showTexture,
                    character: characterCreater
                })
            )
        }

        this._objects.push(...robotInstances);
        this.addChild(...robotInstances);
    }

    _followPlayer (player) {
        let viewSize = Store.getViewSize();

        if (viewSize.width < this._width) {
            let expectedX = viewSize.width / 2 - player.position.x;

            expectedX > 0 && (expectedX = 0);
            expectedX < (viewSize.width - this._width) && (expectedX = viewSize.width - this._width);

            this.x = expectedX;
        }

        if (viewSize.height < this._height) {
            let expectedY = viewSize.height / 2 - player.position.y;

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

    getObjects (filter) {
        if (isFunction(filter)) {
            return this._objects.filter(filter);
        }

        return this._objects;
    }

    getObjectsById (id) {
        for (let obj of this._objects) {
            if (obj.getId() == id) {
                return obj;
            }
        }

        return null;
    }

    getObjectsByName (name) {
        return this._objects.filter(obj => (obj.getName() == name));
    }

    getObjectsByType (type) {
        return this._objects.filter(obj => (obj.getType() == type));
    }

    getObjectsByTag (tag) {
        return this._objects.filter(obj => (obj.getTag() == tag));
    }

    update () {
        this._player && this._followPlayer(this._player);

        for (let obj of this._objects) {
            for (let horizantolTile of this._horizantolTiles) {
                if (horizantolTile.check(obj)) {
                    break;
                }
            }

            for (let verticalTile of this._verticalTiles) {
                if (verticalTile.check(obj)) {
                    break;
                }
            }

            obj.update();
        }
    }

}
