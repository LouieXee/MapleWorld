'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DisplayObjectDebuger = require('../DisplayObjectDebuger');

var _DisplayObjectDebuger2 = _interopRequireDefault(_DisplayObjectDebuger);

var _utils = require('../../utils');

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _PIXI = PIXI,
    Sprite = _PIXI.Sprite,
    Graphics = _PIXI.Graphics,
    Text = _PIXI.Text,
    Point = _PIXI.Point,
    Rectangle = _PIXI.Rectangle;

var DisplayObject = function (_Sprite) {
    (0, _inherits3["default"])(DisplayObject, _Sprite);

    function DisplayObject() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3["default"])(this, DisplayObject);

        var _this = (0, _possibleConstructorReturn3["default"])(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this));

        var _opt$x = opt.x,
            x = _opt$x === undefined ? 0 : _opt$x,
            _opt$y = opt.y,
            y = _opt$y === undefined ? 0 : _opt$y,
            _opt$type = opt.type,
            type = _opt$type === undefined ? '' : _opt$type,
            _opt$id = opt.id,
            id = _opt$id === undefined ? '' : _opt$id,
            _opt$name = opt.name,
            name = _opt$name === undefined ? '' : _opt$name,
            _opt$tag = opt.tag,
            tag = _opt$tag === undefined ? '' : _opt$tag,
            character = opt.character,
            _opt$debug = opt.debug,
            debug = _opt$debug === undefined ? false : _opt$debug,
            _opt$debugColor = opt.debugColor,
            debugColor = _opt$debugColor === undefined ? _config.DISPLAY_OBJECT_DEBUG_COLOR : _opt$debugColor;


        _this.x = x;
        _this.y = y;
        _this._lastPoint = new Point(x, y);
        _this._type = type;
        _this._id = id || (0, _utils.getUniqueId)();
        _this._name = name;
        _this._tag = tag;
        _this._setCharacter(character);

        _this._dir = 'left';
        _this._forces = { gravity: new _utils.Vector(0, _config.GRAVITY * _this._weight) };
        _this._velocity = new _utils.Vector(0, 0);
        _this._lastVelocity = _this._velocity.clone();
        _this._keys = {};
        _this._status = _config.STATUS_STAND;

        _this._events = new _utils.Events();
        _this._debug = debug;

        _this._updateComposedForce();

        debug && _this._setDebugMode(debugColor);
        return _this;
    }

    (0, _createClass3["default"])(DisplayObject, [{
        key: '_setCharacter',
        value: function _setCharacter(character) {
            character = new character(this);

            var _character = character,
                width = _character.width,
                height = _character.height,
                weight = _character.weight,
                animations = _character.animations,
                maxMoveSpeed = _character.maxMoveSpeed;


            this._character = character;
            this._width = width;
            this._height = height;
            this._weight = weight;
            this._maxMoveSpeed = maxMoveSpeed;
            this._currentAnimation = null;
            this._animations = animations;
            this._animationContainer = new Sprite();

            this._animationContainer.anchor.x = .5;
            this._animationContainer.anchor.y = .5;

            this.addChild(this._animationContainer);
        }
    }, {
        key: '_setDebugMode',
        value: function _setDebugMode(color) {
            var _this2 = this;

            this._debuger = new _DisplayObjectDebuger2["default"]({
                displayObj: this,
                color: color
            });

            this.addChildAt(this._debuger, 0);
            this.interactive = true;
            this.buttonMode = true;
            this.on('click', function () {
                _this2._debuger.toggleTextVisible();
            });

            var rectangle = new Graphics();
            var point = new Graphics();
            var status = new Text('STATUS: ');
            var velocity = new Text('');
            var force = new Text('');
            var position = new Text('');
            var dir = new Text('');
            var name = new Text('NAME: ' + this._name.toUpperCase());

            rectangle.lineStyle(1, color, 1);
            rectangle.beginFill(color, .1);
            rectangle.drawRect(-this._width / 2, -this._height, this._width, this._height);
            rectangle.endFill();

            point.beginFill(color);
            point.arc(0, 0, 2, 0, 2 * Math.PI);
            point.endFill();

            this._debuger.addChild(rectangle, point);
            this._debuger.addText(velocity, force, position, dir, status, name);

            this._events.on('upadteStatus', function () {
                status.text = 'STATUS: ' + _this2._status.replace(/^STATUS_/, '');
                dir.text = 'DIR: ' + _this2._dir.toUpperCase();
                position.text = 'POS: x: ' + _this2.x.toFixed(2) + ', y: ' + _this2.y.toFixed(2);
                force.text = 'FORCE: x: ' + _this2._composedForce.x.toFixed(2) + ', y: ' + _this2._composedForce.y.toFixed(2);
                velocity.text = 'VEL: x: ' + _this2._velocity.x.toFixed(2) + ', y: ' + _this2._velocity.y.toFixed(2);
            });
        }
    }, {
        key: '_handleKeys',
        value: function _handleKeys() {
            this._character.handleKeys(this);
        }
    }, {
        key: '_handleVelocity',
        value: function _handleVelocity() {
            this._lastVelocity = this._velocity.clone();
            this._velocity.add(this._composedForce.div(this._weight));

            if (this._composedForce.y == 0 && this._composedForce.x * this._velocity.x >= 0 && Math.abs(this._velocity.x) > this._maxMoveSpeed) {
                this._velocity.x = this._velocity.x > 0 ? this._maxMoveSpeed : -this._maxMoveSpeed;
            }

            if (this._velocity.y > _config.MAX_DROP_SPEED) {
                this._velocity.y = _config.MAX_DROP_SPEED;
            }
        }
    }, {
        key: '_updateStatus',
        value: function _updateStatus() {
            if (this._composedForce.y != 0) {
                this.removeForcesByTag('horizontal');
            }

            if (this._status != _config.STATUS_ATTACK && this._status != _config.STATUS_HIT) {
                if (this._composedForce.y != 0) {
                    this._status = _config.STATUS_AIR;
                } else if (this._velocity.x != 0) {
                    this._status = _config.STATUS_MOVE;
                } else {
                    this._status = _config.STATUS_STAND;
                }
            }

            if (this._status == _config.STATUS_HIT && this._composedForce.y == 0) {
                this._status = _config.STATUS_STAND;
            }

            if (this._dir == 'left') {
                this._animationContainer.scale.x = 1;
            } else if (this._dir == 'right') {
                this._animationContainer.scale.x = -1;
            }

            var animation = this._animations[this._status];

            if (animation != this._currentAnimation) {
                this._animationContainer.removeChild(this._currentAnimation);
                this._animationContainer.addChild(animation);
                this._currentAnimation && this._currentAnimation.stop();
                this._currentAnimation = animation;
                this._currentAnimation.gotoAndPlay(0);
            }

            this._events.emit('upadteStatus');
        }
    }, {
        key: '_updateComposedForce',
        value: function _updateComposedForce() {
            var force = new _utils.Vector(0, 0);

            for (var key in this._forces) {
                force.add(this._forces[key]);
            }

            this._composedForce = force;
        }
    }, {
        key: 'update',
        value: function update() {
            if (this._status == _config.STATUS_DEAD) {
                return false;
            }

            this._handleKeys();

            this._handleVelocity();

            this._updateStatus();

            this._lastPoint.set(this.x, this.y);
            this.x += this._velocity.x;
            this.y += this._velocity.y;
        }
    }, {
        key: 'handleHit',
        value: function handleHit(vx, vy) {
            if (this._status == _config.STATUS_HIT) {
                return false;
            }

            this._character.handleHit(vx, vy);
        }
    }, {
        key: 'addForce',
        value: function addForce(key, fx, fy, tag) {
            if (this._forces[key]) {
                return this;
            }

            var force = null;

            if (fx instanceof _utils.Vector) {
                force = fx;
            } else {
                force = new _utils.Vector(fx, fy);
            }

            tag && force.setTag(tag);

            this._forces[key] = force;
            this._updateComposedForce();

            return this;
        }
    }, {
        key: 'removeForce',
        value: function removeForce(key) {
            delete this._forces[key];

            this._updateComposedForce();

            return this;
        }
    }, {
        key: 'getForce',
        value: function getForce(key) {
            return this._forces[key];
        }
    }, {
        key: 'removeForcesByTag',
        value: function removeForcesByTag(tag) {
            for (var key in this._forces) {
                if (this._forces[key].getTag() == tag) {
                    delete this._forces[key];
                }
            }

            this._updateComposedForce();

            return this;
        }
    }, {
        key: 'hasForce',
        value: function hasForce(key) {
            return !!this._forces[key];
        }
    }, {
        key: 'getRectangle',
        value: function getRectangle() {
            return new Rectangle(this.x - this._width / 2, this.y - this._height, this._width, this._height);
        }
    }, {
        key: 'getTag',
        value: function getTag() {
            return this._tag;
        }
    }, {
        key: 'getType',
        value: function getType() {
            return this._type;
        }
    }, {
        key: 'getName',
        value: function getName() {
            return this._name;
        }
    }, {
        key: 'getId',
        value: function getId() {
            return this._id;
        }
    }, {
        key: 'getWeight',
        value: function getWeight() {
            return this._weight;
        }
    }, {
        key: 'getStatus',
        value: function getStatus() {
            return this._status;
        }
    }, {
        key: 'getWidth',
        value: function getWidth() {
            return this._width;
        }
    }, {
        key: 'getHeight',
        value: function getHeight() {
            return this._height;
        }
    }, {
        key: 'getLastPoint',
        value: function getLastPoint() {
            return this._lastPoint;
        }
    }, {
        key: 'getLastVelocity',
        value: function getLastVelocity() {
            return this._lastVelocity.clone();
        }
    }, {
        key: 'getVelocity',
        value: function getVelocity() {
            return this._velocity.clone();
        }
    }, {
        key: 'getComposedForce',
        value: function getComposedForce() {
            return this._composedForce.clone();
        }
    }, {
        key: 'getDir',
        value: function getDir() {
            return this._dir;
        }
    }, {
        key: 'getKeys',
        value: function getKeys() {
            return this._keys;
        }
    }, {
        key: 'addVelocity',
        value: function addVelocity(v) {
            this._velocity.add(v);

            return this;
        }
    }, {
        key: 'setVelocityY',
        value: function setVelocityY(vy) {
            this._velocity.y = vy;

            return this;
        }
    }, {
        key: 'setVelocityX',
        value: function setVelocityX(vx) {
            this._velocity.x = vx;

            return this;
        }
    }, {
        key: 'setKeys',
        value: function setKeys(keyCode, isDown) {
            this._keys[keyCode] = isDown;

            return this;
        }
    }, {
        key: 'removeAllKeys',
        value: function removeAllKeys() {
            this._keys = {};

            return this;
        }
    }, {
        key: 'setStatus',
        value: function setStatus(status) {
            this._status = status;

            return this;
        }
    }, {
        key: 'setDir',
        value: function setDir(dir) {
            this._dir = dir;

            return this;
        }
    }]);
    return DisplayObject;
}(Sprite);

exports["default"] = DisplayObject;