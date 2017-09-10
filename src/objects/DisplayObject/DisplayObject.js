import { Vector, Events } from '../../utils';
import { GRAVITY, MAX_DROP_SPEED, STATUS_STAND } from '../../config';

const { Sprite, Graphics, Text, Point } = PIXI;

export default class DisplayObject extends Sprite {

    constructor (opt = {}) {
        super();

        const { 
            x = 0, 
            y = 0,
            type = 'others',
            character,
            debug = false,
        } = opt;
        
        this.x = x;
        this.y = y;
        this._type = type;
        this._setCharacter(character);

        this._forces = {
            gravity: new Vector(0, GRAVITY * this._weight)
        };
        this._velocity = new Vector(0, 0);
        this._lastPoint = new Point(x, y);
        this._keys = {};
        this._status = STATUS_STAND;

        this._events = new Events();
        this._debug = debug;

        debug && this._setDebugMode();
    }

    _setCharacter (character) {
        const { 
            width, height, weight, animation, maxMoveSpeed 
        } = character;

        this._character = character;
        this._width = width;
        this._height = height;
        this._weight = weight;
        this._maxMoveSpeed = maxMoveSpeed;
    }

    _setDebugMode () {
        const LINE_HEIGHT = 20;
        const COLOR = 0xFF0000;
        const TEXT_STYLE = { fontSize: 12, fill: COLOR, lineHeight: LINE_HEIGHT };

        let rectangle = new Graphics();
        let point = new Graphics();
        let status = new Text(`STATUS: ${this._status}`, TEXT_STYLE)

        rectangle.lineStyle(1, COLOR, 1);
        rectangle.drawRect(-this._width / 2, -this._height, this._width, this._height);

        point.beginFill(COLOR);
        point.arc(0, 0, 2, 0, 2 * Math.PI);
        point.endFill();

        status.x = -this._width / 2;
        status.y = -this._height - LINE_HEIGHT;

        this.addChild(rectangle, point, status)

        this._events.on('upadteStatus', currentStatus => {
            status.text = `STATUS: ${currentStatus}`
        })
    }

    _updateStatus () {
        this._character.handleStatus(this);

        this._events.emit('upadteStatus', this._status);
    }

    _handleVelocity () {
        let force = this.composeForce();

        this._velocity.add(force.div(this._weight));

        if (Math.abs(this._velocity.x) > this._maxMoveSpeed) {
            this._velocity.x = this._velocity.x > 0 ? this._maxMoveSpeed : -this._maxMoveSpeed;
        }

        if (this._velocity.y > MAX_DROP_SPEED) {
            this._velocity.y = MAX_DROP_SPEED;
        }
    }

    addForce (key, fx, fy, tag) {
        if (this._forces[key]) {
            return this;
        }

        if (fx instanceof Vector) {
            this._forces[key] = fx;

            return this;
        }

        this._forces[key] = new Vector(fx, fy).setTag(tag);

        return this;
    }

    setForce (key, fx, fy) {
        this._forces[key].x = fx;
        this._forces[key].y = fy;

        return this;
    }

    removeForce (key) {
        delete this._forces[key];

        return this;
    }

    removeForcesByTag (tag) {
        for (let key in this._forces) {
            if (this._forces[key].getTag() == tag) {
                delete this._forces[key];
            }
        }

        return this;
    }

    composeForce () {
        let force = new Vector(0, 0);

        for (let key in this._forces) {
            force.add(this._forces[key]);
        }

        return force;
    }

    getMaxMoveSpeed () {
        return this._maxMoveSpeed;
    }

    getWidth () {
        return this._width;
    }

    getHeight () {
        return this._height;
    }

    getLastPoint () {
        return this._lastPoint;
    }

    getVelocity () {
        return this._velocity;
    }

    setVelocityY (vy) {
        this._velocity.y = vy;

        return this;
    }

    setVelocityX (vx) {
        this._velocity.x = vx;

        return this;
    }

    setKeys (keyCode, isDown) {
        this._keys[keyCode] = isDown;

        return this;
    }

    update () {
        this._updateStatus();

        this._handleVelocity();

        this._lastPoint.set(this.x, this.y);
        this.x += this._velocity.x;
        this.y += this._velocity.y;
    }

}
