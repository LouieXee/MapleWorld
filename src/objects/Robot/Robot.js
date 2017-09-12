import DisplayObject from '../DisplayObject';

import { 
	MAX_STOP_COUNT, ROBOT_DEBUG_COLOR,
    KEY_MOVE_LEFT, KEY_MOVE_UP, KEY_MOVE_RIGHT, KEY_MOVE_DOWN, 
    KEY_JUMP, KEY_ATTACK, KEY_SKILL1, KEY_SKILL2,
    STATUS_STAND, STATUS_MOVE
} from '../../config';

const { Graphics, Rectangle, Text } = PIXI;

export default class Robot extends DisplayObject {

	constructor (opt = {}) {
		const {
			range,
			alertRange = [-100, -130, 200, 130],

			...rest
		} = opt;

		super({
			...rest,

			debugColor: ROBOT_DEBUG_COLOR
		});

		this._range = range;
		this._alertRange = new Rectangle(alertRange[0], alertRange[1], alertRange[2], alertRange[3]);

		this._robotStatus = 'active';
		this._target = null;
		this._changeDirCount = 0;
		this._stopCount = 0;
		this._lastCheckTime = 0;
		this._inactiveTimeoutId = -1;

		this._maxChangeDirCount = this._getMaxChangeDirCount();
		this._checkDelta = this._getCheckDelta();

		this._debuger && this._setRobotDebugMode();
	}

	_setRobotDebugMode () {
		let rectangle = new Graphics();
		let robotStatus = new Text('');
		let target = new Text('');

		rectangle.beginFill(ROBOT_DEBUG_COLOR, .1);
		rectangle.drawRect(this._alertRange.x, this._alertRange.y, this._alertRange.width, this._alertRange.height);
		rectangle.endFill();

		this._debuger.addChild(rectangle);
		this._debuger.addTextAt([target, robotStatus], 4);

		this._events
		.on('upadteStatus', () => {
            robotStatus.text = `ROBOT STATUS: ${this._robotStatus.toUpperCase()}`;
            target.text = `ROBOT TARGET: x: ${this._target.x}, y: ${this._target.y}`;
        })
	}

	_getTarget () {
		let range = this._range || [0, 0, this.parent.width, this.parent.height];

		let targetX = Math.floor(range[0] + Math.random() * range[2]);
		let targetY = Math.floor(range[1] + Math.random() * range[3]);

		this._target = {
			x: targetX,
			y: targetY
		};
	}

	_checkTarget () {
		if (this.x <= this._target.x && !this._keys[KEY_MOVE_RIGHT]) {
			this._changeDirCount++;
			this._keys[KEY_MOVE_LEFT] = false;
			this._keys[KEY_MOVE_RIGHT] = true;
		} else if (this.x > this._target.x && !this._keys[KEY_MOVE_LEFT]) {
			this._changeDirCount++;
			this._keys[KEY_MOVE_LEFT] = true;
			this._keys[KEY_MOVE_RIGHT] = false;
		}

		if (this.y > this._target.y || this.hasForce('horizontal-pressure')) {
			this._keys[KEY_JUMP] = true;
		}
	}

	_shouldStop () {
		if (this._changeDirCount > this._maxChangeDirCount || this._stopCount > MAX_STOP_COUNT) {
			return true;
		}

		return false;
	}

	_getMaxChangeDirCount () {
		return 3 + Math.floor(Math.random() * 3);
	}

	_getCheckDelta () {
		return 500 + Math.floor(Math.random() * 1000);
	}

	_getInactiveDuration () {
		return 2000 + Math.floor(Math.random() * 1000);
	}

	_doInactive () {
		clearTimeout(this._inactiveTimeoutId);

		this._robotStatus = 'inactive';
		this.removeAllKeys();

		this._inactiveTimeoutId = setTimeout(() => {
			this._robotStatus = 'active';

			this._getTarget();
			this._maxChangeDirCount = this._getMaxChangeDirCount();
			
			this._changeDirCount = 0;
			this._stopCount = 0;
		}, this._getInactiveDuration())
	}

	_doActive () {
		this._keys[KEY_JUMP] = false;
		this._keys[KEY_ATTACK] = false;
		this._keys[KEY_SKILL1] = false;
		this._keys[KEY_SKILL2] = false;

		let currentTime = new Date().getTime();

		if (currentTime - this._lastCheckTime > this._checkDelta) {
			this._lastCheckTime = new Date().getTime();
			this._checkDelta = this._getCheckDelta();
			this._checkTarget();
		}

		if (this._lastPoint.x == this.x) {
			this._stopCount++;
		} else {
			this._stopCount = 0;
		}
	}

	update () {
		!this._target && this._getTarget();

		if (this._robotStatus != 'inactive' && this._shouldStop()) {
			this._doInactive();
		} else if (this._robotStatus == 'active') {
			this._doActive();
		}

		super.update();
	}

}
