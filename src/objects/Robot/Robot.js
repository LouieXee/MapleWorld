import DisplayObject from '../DisplayObject';

import { 
    KEY_MOVE_LEFT, KEY_MOVE_UP, KEY_MOVE_RIGHT, KEY_MOVE_DOWN, 
    KEY_JUMP, KEY_ATTACK, KEY_SKILL1, KEY_SKILL2,
    STATUS_STAND, STATUS_MOVE
} from '../../config';

export default class Robot extends DisplayObject {

	constructor (opt = {}) {
		super({
			...opt,

			debugColor: 0x00FF00
		});

		this._robotStatus = 'normal';
		this._count = 0;
		this._countTarget = 0;
	}

	_handleNormalStatus () {
		let _this = this;
		let status = this._status;

		if (status == STATUS_STAND && this._count++ >= this._countTarget) {
			let dir = Math.floor(Math.random() * 2) == 0 ? KEY_MOVE_LEFT : KEY_MOVE_RIGHT;

			this._keys[KEY_MOVE_LEFT] = false;
			this._keys[KEY_MOVE_RIGHT] = false;
			this._keys[dir] = true;
			_resetCount();
		} else if (status == STATUS_MOVE && this._count++ >= this._countTarget) {
			this._keys[KEY_MOVE_LEFT] = false;
			this._keys[KEY_MOVE_RIGHT] = false;
			_resetCount();
		}

		if (Math.floor(Math.random() * 160) == 0) {
			this._keys[KEY_JUMP] = true;
		} else {
			this._keys[KEY_JUMP] = false;
		}

		function _resetCount () {
			_this._count = 0;
			_this._countTarget = Math.floor(Math.random() * 100) + 100;
		}
	}

	update () {
		if (this._robotStatus == 'normal') {
			this._handleNormalStatus();
		} else if (this._robotStatus == 'radical') {}

		super.update();
	}

}
