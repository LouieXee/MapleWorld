'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('../../utils');

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TextureCache = PIXI.utils.TextureCache;
var AnimatedSprite = PIXI.extras.AnimatedSprite;

var Character = function () {
    function Character(displayObj) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        (0, _classCallCheck3["default"])(this, Character);
        var _opt$width = opt.width,
            width = _opt$width === undefined ? 60 : _opt$width,
            _opt$height = opt.height,
            height = _opt$height === undefined ? 100 : _opt$height,
            _opt$weight = opt.weight,
            weight = _opt$weight === undefined ? 1 : _opt$weight,
            _opt$animations = opt.animations,
            animations = _opt$animations === undefined ? {} : _opt$animations,
            _opt$maxMoveSpeed = opt.maxMoveSpeed,
            maxMoveSpeed = _opt$maxMoveSpeed === undefined ? 3 : _opt$maxMoveSpeed,
            _opt$jumpVelocity = opt.jumpVelocity,
            jumpVelocity = _opt$jumpVelocity === undefined ? new _utils.Vector(0, -15) : _opt$jumpVelocity,
            _opt$moveForce = opt.moveForce,
            moveForce = _opt$moveForce === undefined ? new _utils.Vector(1, 0).setTag('horizontal') : _opt$moveForce;


        this._displayObj = displayObj;

        this.width = width;
        this.height = height;
        this.weight = weight;
        this.animations = animations;
        this.jumpVelocity = jumpVelocity;
        this.moveForce = moveForce;
        this.maxMoveSpeed = maxMoveSpeed;

        this._events = new _utils.Events();
    }

    (0, _createClass3["default"])(Character, [{
        key: 'handleHit',
        value: function handleHit(vx, vy) {
            var obj = this._displayObj;

            obj.setVelocityX(vx).setVelocityY(vy).setStatus(_config.STATUS_HIT);

            this._events.emit('hit');
        }
    }, {
        key: 'handleKeys',
        value: function handleKeys() {
            var obj = this._displayObj;
            var keys = obj.getKeys();
            var composedForce = obj.getComposedForce();

            // 可操作状态
            if (composedForce.y == 0 && obj.getStatus() != _config.STATUS_HIT && obj.getStatus() != _config.STATUS_ATTACK) {
                // 移动
                if (keys[_config.KEY_MOVE_LEFT] || keys[_config.KEY_MOVE_RIGHT]) {
                    keys[_config.KEY_MOVE_LEFT] && obj.addForce('moveLeft', this.moveForce.clone().invertX());
                    keys[_config.KEY_MOVE_RIGHT] && obj.addForce('moveRight', this.moveForce.clone());
                }

                // 停止移动
                if (!keys[_config.KEY_MOVE_LEFT] || !keys[_config.KEY_MOVE_RIGHT]) {
                    !keys[_config.KEY_MOVE_LEFT] && obj.removeForce('moveLeft');
                    !keys[_config.KEY_MOVE_RIGHT] && obj.removeForce('moveRight');
                }

                // 跳跃
                if (keys[_config.KEY_JUMP]) {
                    obj.addVelocity(this.jumpVelocity);
                }
            }

            // 可攻击状态 
            if ((keys[_config.KEY_ATTACK] || keys[_config.KEY_SKILL1] || keys[_config.KEY_SKILL2]) && obj.getStatus() != _config.STATUS_HIT && obj.getStatus() != _config.STATUS_ATTACK) {
                obj.removeForce('moveLeft');
                obj.removeForce('moveRight');

                this._events.emit('attack', keys[_config.KEY_ATTACK] && 'attack' || keys[_config.KEY_SKILL1] && 'skill1' || keys[_config.KEY_SKILL2] && 'skill2');
            }

            // 调整朝向
            if (!(keys[_config.KEY_MOVE_LEFT] && keys[_config.KEY_MOVE_RIGHT]) && obj.getStatus() != _config.STATUS_HIT && obj.getStatus() != _config.STATUS_ATTACK) {
                keys[_config.KEY_MOVE_LEFT] && obj.setDir('left');
                keys[_config.KEY_MOVE_RIGHT] && obj.setDir('right');
            }
        }
    }], [{
        key: 'createAnimatedSprite',
        value: function createAnimatedSprite(textureName) {
            var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var frames = [];
            var animatedSprite = null;

            for (var i = 1; i <= size; i++) {
                frames.push(TextureCache['' + textureName + ('0' + i).slice(-2) + '.png']);
            }

            animatedSprite = new AnimatedSprite(frames);

            animatedSprite.x = -animatedSprite.width / 2;
            animatedSprite.y = -animatedSprite.height;

            for (var key in opt) {
                animatedSprite[key] = opt[key];
            }

            return animatedSprite;
        }
    }]);
    return Character;
}();

exports["default"] = Character;