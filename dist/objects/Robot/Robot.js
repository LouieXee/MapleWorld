'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DisplayObject2 = require('../DisplayObject');

var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

var _utils = require('../../utils');

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _PIXI = PIXI,
    Graphics = _PIXI.Graphics,
    Rectangle = _PIXI.Rectangle,
    Text = _PIXI.Text;

var Robot = function (_DisplayObject) {
	(0, _inherits3["default"])(Robot, _DisplayObject);

	function Robot() {
		var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		(0, _classCallCheck3["default"])(this, Robot);
		var range = opt.range,
		    alertRange = opt.alertRange,
		    _opt$robotType = opt.robotType,
		    robotType = _opt$robotType === undefined ? 'cautious' : _opt$robotType,
		    rest = (0, _objectWithoutProperties3["default"])(opt, ['range', 'alertRange', 'robotType']);

		var _this = (0, _possibleConstructorReturn3["default"])(this, (Robot.__proto__ || Object.getPrototypeOf(Robot)).call(this, (0, _extends3["default"])({}, rest, {

			type: 'robot',
			debugColor: _config.ROBOT_DEBUG_COLOR
		})));

		_this._range = range;
		_this._alertRange = alertRange ? new (Function.prototype.bind.apply(Rectangle, [null].concat((0, _toConsumableArray3["default"])(alertRange))))() : new Rectangle(-_this._width / 2, -_this._height, _this._width, _this._height);
		_this._robotType = robotType; // radical cautious

		_this._robotStatus = 'active'; // inactive active
		_this._target = null;
		_this._changeDirCount = 0;
		_this._stopCount = 0;
		_this._lastCheckTime = 0;
		_this._inactiveTimeoutId = -1;

		_this._maxChangeDirCount = _this._getMaxChangeDirCount();
		_this._maxStopCount = _this._getMaxStopCount();
		_this._checkDelta = _this._getCheckDelta();

		_this._debug && _this._setRobotDebugMode();
		return _this;
	}

	(0, _createClass3["default"])(Robot, [{
		key: '_setRobotDebugMode',
		value: function _setRobotDebugMode() {
			var _this2 = this;

			var robotStatus = new Text('');
			var robotType = new Text('ROBOT TYPE: ' + this._robotType.toUpperCase());
			var target = new Text('');

			if (this._robotType == 'radical') {
				var rectangle = new Graphics();

				rectangle.beginFill(_config.ROBOT_DEBUG_COLOR, .1);
				rectangle.drawRect(this._alertRange.x, this._alertRange.y, this._alertRange.width, this._alertRange.height);
				rectangle.endFill();

				this._debuger.addChild(rectangle);
			}

			this._debuger.addTextAt([target, robotStatus, robotType], 4);

			this._events.on('upadteStatus', function () {
				robotStatus.text = 'ROBOT STATUS: ' + _this2._robotStatus.toUpperCase();
				target.text = 'TARGET: x: ' + _this2._target.x.toFixed(2) + ', y: ' + _this2._target.y.toFixed(2);
			});
		}
	}, {
		key: '_getRandomTarget',
		value: function _getRandomTarget() {
			var range = this._range || [0, 0, this.parent.width, this.parent.height];

			var targetX = Math.floor(range[0] + Math.random() * range[2]);
			var targetY = Math.floor(range[1] + Math.random() * range[3]);

			return {
				isRandomTarget: true,
				x: targetX,
				y: targetY
			};
		}
	}, {
		key: '_checkTarget',
		value: function _checkTarget() {
			if (this.x <= this._target.x && !this._keys[_config.KEY_MOVE_RIGHT]) {
				this._changeDirCount++;
				this._keys[_config.KEY_MOVE_LEFT] = false;
				this._keys[_config.KEY_MOVE_RIGHT] = true;
			} else if (this.x > this._target.x && !this._keys[_config.KEY_MOVE_LEFT]) {
				this._changeDirCount++;
				this._keys[_config.KEY_MOVE_LEFT] = true;
				this._keys[_config.KEY_MOVE_RIGHT] = false;
			}

			if (this.y > this._target.y || this.hasForce('horizontal-pressure')) {
				this._keys[_config.KEY_JUMP] = true;
			}
		}
	}, {
		key: '_detectEnemy',
		value: function _detectEnemy(enemies) {
			var bodyRect = this.getRectangle();

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = enemies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var enemy = _step.value;

					var enemyRect = enemy.getRectangle();

					if ((0, _utils.testRectangleHit)(enemyRect, bodyRect)) {
						enemy.handleHit((enemy.x > this.x ? 1 : -1) * _config.HIT_VEL_X, _config.HIT_VEL_Y);
					}

					if (this._target.isRandomTarget && this._robotType == 'radical' && (0, _utils.testRectangleHit)(enemyRect, new Rectangle(this.x + this._alertRange.x, this.y + this._alertRange.y, this._alertRange.width, this._alertRange.height))) {
						this._robotStatus = 'active';
						this._setTarget(enemy);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: '_shouldStop',
		value: function _shouldStop() {
			if (this._changeDirCount > this._maxChangeDirCount || this._stopCount > this._maxStopCount) {
				return true;
			}

			return false;
		}
	}, {
		key: '_setTarget',
		value: function _setTarget(target) {
			this._target = target;
			this._maxChangeDirCount = this._getMaxChangeDirCount();
			this._maxStopCount = this._getMaxStopCount();

			this._changeDirCount = 0;
			this._stopCount = 0;
		}
	}, {
		key: '_doInactive',
		value: function _doInactive() {
			var _this3 = this;

			clearTimeout(this._inactiveTimeoutId);

			this._robotStatus = 'inactive';
			this.removeAllKeys();

			this._inactiveTimeoutId = setTimeout(function () {
				_this3._robotStatus = 'active';
				_this3._setTarget(_this3._getRandomTarget());
			}, this._getInactiveDuration());
		}
	}, {
		key: '_doActive',
		value: function _doActive() {
			this._keys[_config.KEY_JUMP] = false;
			this._keys[_config.KEY_ATTACK] = false;
			this._keys[_config.KEY_SKILL1] = false;
			this._keys[_config.KEY_SKILL2] = false;

			var currentTime = new Date().getTime();

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
	}, {
		key: 'update',
		value: function update() {
			var _this4 = this;

			var enemies = this.parent.getObjects(function (obj) {
				return (obj.getType() == 'player' || obj.getType() == 'robot') && obj.getTag() != _this4._tag;
			});

			!this._target && this._setTarget(this._getRandomTarget());

			this._detectEnemy(enemies);

			if (this._robotStatus != 'inactive' && this._shouldStop()) {
				this._doInactive();
			} else if (this._robotStatus == 'active') {
				this._doActive();
			}

			(0, _get3["default"])(Robot.prototype.__proto__ || Object.getPrototypeOf(Robot.prototype), 'update', this).call(this);
		}
	}, {
		key: '_getMaxChangeDirCount',
		value: function _getMaxChangeDirCount() {
			if (this._robotStatus == 'alert') {
				return 10 + Math.floor(Math.random() * 10);
			}

			return 5 + Math.floor(Math.random() * 3);
		}
	}, {
		key: '_getMaxStopCount',
		value: function _getMaxStopCount() {
			if (this._robotStatus == 'alert') {
				return 300;
			}

			return 100;
		}
	}, {
		key: '_getCheckDelta',
		value: function _getCheckDelta() {
			return 500 + Math.floor(Math.random() * 1000);
		}
	}, {
		key: '_getInactiveDuration',
		value: function _getInactiveDuration() {
			return 2000 + Math.floor(Math.random() * 1000);
		}
	}]);
	return Robot;
}(_DisplayObject3["default"]);

exports["default"] = Robot;