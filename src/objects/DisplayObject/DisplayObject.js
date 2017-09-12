import DisplayObjectDebuger from '../DisplayObjectDebuger';

import { Vector, Events, getUniqueId } from '../../utils';
import { 
    DISPLAY_OBJECT_DEBUG_COLOR,
    GRAVITY, MAX_DROP_SPEED, 
    STATUS_STAND, STATUS_MOVE, STATUS_AIR, STATUS_ATTACK, STATUS_HIT, STATUS_DEAD
} from '../../config';

const { Sprite, Graphics, Text, Point, Rectangle } = PIXI;

export default class DisplayObject extends Sprite {

    constructor (opt = {}) {
        super();

        const { 
            x = 0, 
            y = 0,
            type = '',
            id = '',
            name = '',
            tag = '',
            character,
            debug = false,

            debugColor = DISPLAY_OBJECT_DEBUG_COLOR
        } = opt;
        
        this.x = x;
        this.y = y;
        this._lastPoint = new Point(x, y);
        this._type = type;
        this._id = id || getUniqueId();
        this._name = name;
        this._tag = tag;
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

    _setDebugMode (color) {
        this._debuger = new DisplayObjectDebuger({
            displayObj: this,
            color
        });

        this.addChild(this._debuger);
        this.interactive = true;
        this.buttonMode = true;
        this.on('click', () => {
            this._debuger.toggleTextVisible();
        })

        let rectangle = new Graphics();
        let point = new Graphics();
        let status = new Text('STATUS: ')
        let velocity = new Text('');
        let force = new Text('');
        let position = new Text('');
        let dir = new Text('');
        let name = new Text(`NAME: ${this._name.toUpperCase()}`);
        
        rectangle.lineStyle(1, color, 1);
        rectangle.beginFill(color, .1);
        rectangle.drawRect(-this._width / 2, -this._height, this._width, this._height);
        rectangle.endFill();

        point.beginFill(color);
        point.arc(0, 0, 2, 0, 2 * Math.PI);
        point.endFill();

        this._debuger.addChild(rectangle, point);
        this._debuger.addText(velocity, force, position, dir, status, name);

        this._events
        .on('upadteStatus', () => {
            status.text = `STATUS: ${this._status.replace(/^STATUS_/, '')}`;
            dir.text = `DIR: ${this._dir.toUpperCase()}`;
            position.text = `POS: x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}`
            force.text = `FORCE: x: ${this._composedForce.x.toFixed(2)}, y: ${this._composedForce.y.toFixed(2)}`;
            velocity.text = `VEL: x: ${this._velocity.x.toFixed(2)}, y: ${this._velocity.y.toFixed(2)}`;
        })
    }

    _handleKeys () {
        this._character.handleKeys(this);
    }

    _updateStatus () {
        if (this._status != STATUS_ATTACK && this._status != STATUS_HIT) {
            if (this._composedForce.y != 0) {
                this._status = STATUS_AIR;

                this.removeForcesByTag('horizontal')
            } else if (this._velocity.x != 0) {
                this._status = STATUS_MOVE;
            } else {
                this._status = STATUS_STAND;
            }
        }

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
    
    getRectangle () {
        return new Rectangle(this.x - this._width / 2, this.y - this._height, this._width, this._height);
    }

    getTag () {
        return this._tag;
    }

    getType () {
        return this._type;
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

    removeAllKeys () {
        this._keys = {};

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
        if (this._status == STATUS_DEAD) {
            return false;
        }

        this._handleKeys();
        
        this._handleVelocity();

        this._updateStatus();

        this._lastPoint.set(this.x, this.y);
        this.x += this._velocity.x;
        this.y += this._velocity.y;
    }

}
