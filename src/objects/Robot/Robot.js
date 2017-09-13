import DisplayObject from '../DisplayObject';

import { testRectangleHit } from '../../utils';
import { 
	ROBOT_DEBUG_COLOR, HIT_VEL_X, HIT_VEL_Y,
    KEY_MOVE_LEFT, KEY_MOVE_UP, KEY_MOVE_RIGHT, KEY_MOVE_DOWN, 
    KEY_JUMP, KEY_ATTACK, KEY_SKILL1, KEY_SKILL2,
    STATUS_STAND, STATUS_MOVE
} from '../../config';

const { Graphics, Rectangle, Text } = PIXI;

export default class Robot extends DisplayObject {

	constructor (opt = {}) {
		const {
			range,
			alertRange,
			robotType = 'cautious',

			...rest
		} = opt;

		super({
			...rest,

			type: 'robot',
			debugColor: ROBOT_DEBUG_COLOR
		});

		this._range = range;
		this._alertRange = alertRange ? new Rectangle(...alertRange) : new Rectangle(-this._width / 2, -this._height, this._width, this._height);
		this._robotType = robotType; // radical cautious

		this._robotStatus = 'active'; // inactive active
		this._target = null;
		this._changeDirCount = 0;
		this._stopCount = 0;
		this._lastCheckTime = 0;
		this._inactiveTimeoutId = -1;

		this._maxChangeDirCount = this._getMaxChangeDirCount();
		this._maxStopCount = this._getMaxStopCount();
		this._checkDelta = this._getCheckDelta();

		this._debug && this._setRobotDebugMode();
	}

	_setRobotDebugMode () {
		let robotStatus = new Text('');
		let robotType = new Text(`ROBOT TYPE: ${this._robotType.toUpperCase()}`);
		let target = new Text('');

		if (this._robotType == 'radical') {
			let rectangle = new Graphics();

			rectangle.beginFill(ROBOT_DEBUG_COLOR, .1);
			rectangle.drawRect(this._alertRange.x, this._alertRange.y, this._alertRange.width, this._alertRange.height);
			rectangle.endFill();

			this._debuger.addChild(rectangle);
		}

		this._debuger.addTextAt([target, robotStatus, robotType], 4);

		this._events
		.on('upadteStatus', () => {
            robotStatus.text = `ROBOT STATUS: ${this._robotStatus.toUpperCase()}`;
            target.text = `TARGET: x: ${this._target.x.toFixed(2)}, y: ${this._target.y.toFixed(2)}`;
        })
	}

	_getRandomTarget () {
		let range = this._range || [0, 0, this.parent.width, this.parent.height];

		let targetX = Math.floor(range[0] + Math.random() * range[2]);
		let targetY = Math.floor(range[1] + Math.random() * range[3]);

		return {
			isRandomTarget: true,
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

	_detectEnemy (enemies) {
		let bodyRect = this.getRectangle();

		for (let enemy of enemies) {
			let enemyRect = enemy.getRectangle();

			if (testRectangleHit(enemyRect, bodyRect)) {
				enemy.handleHit((enemy.x > this.x ? 1 : -1) * HIT_VEL_X, HIT_VEL_Y);
			}

			if (this._target.isRandomTarget 
				&& this._robotType == 'radical' 
				&& testRectangleHit(
					enemyRect, 
					new Rectangle(this.x + this._alertRange.x, this.y + this._alertRange.y, this._alertRange.width, this._alertRange.height)
				)
			) {
				this._robotStatus = 'active';
				this._setTarget(enemy)
			}
		}
	}

	_shouldStop () {
		if (this._changeDirCount > this._maxChangeDirCount || this._stopCount > this._maxStopCount) {
			return true;
		}

		return false;
	}

	_setTarget (target) {
		this._target = target;
		this._maxChangeDirCount = this._getMaxChangeDirCount();
		this._maxStopCount = this._getMaxStopCount();

		this._changeDirCount = 0;
		this._stopCount = 0;
	}

	_doInactive () {
		clearTimeout(this._inactiveTimeoutId);

		this._robotStatus = 'inactive';
		this.removeAllKeys();

		this._inactiveTimeoutId = setTimeout(() => {
			this._robotStatus = 'active';
			this._setTarget(this._getRandomTarget());
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
		let enemies = this.parent.getObjects(obj => (
			(obj.getType() == 'player' || obj.getType() == 'robot') && obj.getTag() != this._tag
		));

		!this._target && this._setTarget(this._getRandomTarget());

		this._detectEnemy(enemies);

		if (this._robotStatus != 'inactive' && this._shouldStop()) {
			this._doInactive();
		} else if (this._robotStatus == 'active') {
			this._doActive();
		}

		

		super.update();
	}

	_getMaxChangeDirCount () {
		if (this._robotStatus == 'alert') {
			return 10 + Math.floor(Math.random() * 10);
		}

		return 5 + Math.floor(Math.random() * 3);
	}

	_getMaxStopCount () {
		if (this._robotStatus == 'alert') {
			return 300;
		}

		return 100;
	}

	_getCheckDelta () {
		return 500 + Math.floor(Math.random() * 1000);
	}

	_getInactiveDuration () {
		return 2000 + Math.floor(Math.random() * 1000);
	}

}
