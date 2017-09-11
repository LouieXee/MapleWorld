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
            id,
            name,
            character,
            debug = false,

            debugColor = 0xFF0000
        } = opt;
        
        this.x = x;
        this.y = y;
        this._lastPoint = new Point(x, y);
        this._type = type;
        this._id = id;
        this._name = name;
        this._setCharacter(character);

        this._dir = 'left';
        this._forces = { gravity: new Vector(0, GRAVITY * this._weight) };
        this._velocity = new Vector(0, 0);
        this._lastVelocity = this._velocity.clone();
        this._keys = {};
        this._status = STATUS_STAND;

        this._events = new Events();
        this._debug = debug;

        this._updateComposedForce();

        debug && this._setDebugMode(debugColor);
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

    _setDebugMode (debugColor) {
        const LINE_HEIGHT = 20;
        const COLOR = debugColor;
        const TEXT_STYLE = { fontSize: 12, fill: COLOR, lineHeight: LINE_HEIGHT };

        let rectangle = new Graphics();
        let point = new Graphics();
        let status = new Text(`STATUS: ${this._status}`, TEXT_STYLE)
        let velocity = new Text(`VEL: x: 0, y: 0`, TEXT_STYLE);
        let force = new Text(`FORCE: x: 0, y: 0`, TEXT_STYLE);
        let dir = new Text(`DIR: ${this._dir}`, TEXT_STYLE);
        let name = new Text(`NAME: ${this._name.toUpperCase()}`, TEXT_STYLE);
        let texts = [velocity, force, status, dir, name];

        rectangle.lineStyle(1, COLOR, 1);
        rectangle.drawRect(-this._width / 2, -this._height, this._width, this._height);

        point.beginFill(COLOR);
        point.arc(0, 0, 2, 0, 2 * Math.PI);
        point.endFill();

        texts.forEach((text, index) => {
            text.x = -this._width / 2;
            text.y = -this._height - (index + 1) * LINE_HEIGHT;
        })

        this.addChild(rectangle, point, ...texts)

        this._events.on('upadteStatus', () => {
            status.text = `STATUS: ${this._status}`;
            velocity.text = `VEL: x: ${this._velocity.x.toFixed(2)}, y: ${this._velocity.y.toFixed(2)}`;
            force.text = `FORCE: x: ${this._composedForce.x.toFixed(2)}, y: ${this._composedForce.y.toFixed(2)}`;
            dir.text = `DIR: ${this._dir.toUpperCase()}`;
        })
    }

    _updateStatus () {
        this._character.handleStatus(this);

        this._events.emit('upadteStatus');
    }

    _handleVelocity () {
        this._lastVelocity = this._velocity.clone();
        this._velocity.add(this._composedForce.div(this._weight));

        if (this._composedForce.y == 0 && this._composedForce.x * this._velocity.x >=0 &&  Math.abs(this._velocity.x) > this._maxMoveSpeed) {
            this._velocity.x = this._velocity.x > 0 ? this._maxMoveSpeed : -this._maxMoveSpeed;
        }

        if (this._velocity.y > MAX_DROP_SPEED) {
            this._velocity.y = MAX_DROP_SPEED;
        }
    }

    _updateComposedForce () {
        let force = new Vector(0, 0);

        for (let key in this._forces) {
            force.add(this._forces[key]);
        }

        this._composedForce = force;
    }

    addForce (key, fx, fy, tag) {
        if (this._forces[key]) {
            return this;
        }

        let force = null;

        if (fx instanceof Vector) {
            force = fx;
        } else {
            force = new Vector(fx, fy);
        }

        tag && force.setTag(tag);

        this._forces[key] = force;
        this._updateComposedForce();

        return this;
    }

    removeForce (key) {
        delete this._forces[key];

        this._updateComposedForce();

        return this;
    }

    getForce (key) {
        return this._forces[key];
    }

    removeForcesByTag (tag) {
        for (let key in this._forces) {
            if (this._forces[key].getTag() == tag) {
                delete this._forces[key];
            }
        }

        this._updateComposedForce();

        return this;
    }

    hasForce (key) {
        return !!this._forces[key];
    }

    getName () {
        return this._name;
    }

    getId () {
        return this._id;
    }

    getWeight () {
        return this._weight;
    }

    getStatus () {
        return this._status;
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

    getLastVelocity () {
        return this._lastVelocity.clone();
    }

    getVelocity () {
        return this._velocity.clone();
    }

    getComposedForce () {
        return this._composedForce.clone();
    }

    getDir () {
        return this._dir;
    }

    getKeys () {
        return this._keys;
    }

    addVelocity (v) {
        this._velocity.add(v);

        return this;
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

    setStatus (status) {
        this._status = status;

        return this;
    }

    setDir (dir) {
        this._dir = dir;

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
