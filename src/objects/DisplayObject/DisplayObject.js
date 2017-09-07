import { Vector } from '../../utils';
import { GRAVITY, MAX_DROP_SPEED, MAX_MOVE_SPEED } from '../../config';

const { Sprite, Graphics } = PIXI;

export default class DisplayObject extends Sprite {

    constructor (opt = {}) {
        super();

        const { 
            x = 0, 
            y = 0,
            type = 'type-a',
            character,
            debug = false,
        } = opt;
        
        this.x = x;
        this.y = y;
        this._type = type;
        this._forces = {
            gravity: new Vector(0, GRAVITY)
        };
        this._velocity = new Vector(0, 0);
        this._lastPoint = { x: x, y: y };
        this._keys = {};
        this._setCharacter(character);

        this._debug = debug;

        debug && this._setDebugMode();
    }

    _setCharacter (character) {
        const { width, height, weight, animation } = character;

        this._character = character;
        this._width = width;
        this._height = height;
        this._weight = weight;
    }

    _setDebugMode () {
        let rectangle = new Graphics();

        rectangle.lineStyle(1, 0xFF0000, 1);
        rectangle.drawRect(-this._width / 2, -this._height, this._width, this._height);

        this.addChild(rectangle)
    }

    _handleKeys () {
        this._character.handleKeys(this);
    }

    _handleVelocity () {
        let force = new Vector(0, 0);

        for (let key in this._forces) {
            force.add(this._forces[key]);
        }

        this._velocity.add(force.div(this._weight));

        if (Math.abs(this._velocity.x) > MAX_MOVE_SPEED) {
            this._velocity.x = this._velocity.x > 0 ? MAX_MOVE_SPEED : -MAX_MOVE_SPEED;
        }

        if (this._velocity.y > MAX_DROP_SPEED) {
            this._velocity.y = MAX_DROP_SPEED;
        }
    }

    addForce (fx, fy, key) {
        this._forces[key] = new Vector(fx, fy);

        return this;
    }

    removeForce (key) {
        delete this._forces[key];

        return this;
    }

    getVelocityY () {
        return this._velocity.y;
    }

    setVelocityY (vy) {
        this._velocity.y = vy;

        return this;
    }

    getVelocityX () {
        return this._velocity.x;
    }

    setVelocityX (vx) {
        this._velocity.x = vx;

        return this;
    }

    getLastY () {
        return this._lastPoint.y;
    }

    getLastX () {
        return this._lastPoint.x;
    }

    setKeys (keyCode, isDown) {
        this._keys[keyCode] = isDown;
    }

    update () {
        this._handleKeys();

        this._handleVelocity();

        this._lastPoint.x = this.x;
        this._lastPoint.y = this.y;
        this.x += this._velocity.x;
        this.y += this._velocity.y;
    }

}
