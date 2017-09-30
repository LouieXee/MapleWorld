'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _Character2 = require('../Character');

var _Character3 = _interopRequireDefault(_Character2);

var _utils = require('../../utils');

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createAnimatedSprite = _Character3["default"].createAnimatedSprite;

var Ninja = function (_Character) {
    (0, _inherits3["default"])(Ninja, _Character);

    function Ninja(displayObj) {
        var _animations;

        (0, _classCallCheck3["default"])(this, Ninja);

        var _this = (0, _possibleConstructorReturn3["default"])(this, (Ninja.__proto__ || Object.getPrototypeOf(Ninja)).call(this, displayObj, {
            width: 75,
            height: 70,
            maxMoveSpeed: 5,
            animations: (_animations = {}, (0, _defineProperty3["default"])(_animations, _config.STATUS_HIT, createAnimatedSprite('ninja-hit')), (0, _defineProperty3["default"])(_animations, _config.STATUS_AIR, createAnimatedSprite('ninja-move')), (0, _defineProperty3["default"])(_animations, _config.STATUS_STAND, createAnimatedSprite('ninja-stand', 5, { animationSpeed: 0.16 })), (0, _defineProperty3["default"])(_animations, _config.STATUS_MOVE, createAnimatedSprite('ninja-move', 3, { animationSpeed: 0.16 })), (0, _defineProperty3["default"])(_animations, _config.STATUS_ATTACK, createAnimatedSprite('ninja-attack', 6, {
                animationSpeed: 0.25,
                onFrameChange: function onFrameChange(frameIndex) {
                    if (frameIndex == 5) {
                        displayObj.setStatus(_config.STATUS_STAND);
                    }
                }
            })), (0, _defineProperty3["default"])(_animations, _config.STATUS_DEAD, createAnimatedSprite('ninja-die', 10, { animationSpeed: 0.13 })), _animations)
        }));

        _this._isCanAirJump = false;
        _this._jumpCount = 0;
        _this._airJumpVelocity = new _utils.Vector(10, -20);

        _this._events.on('attack', function (type) {
            type == 'attack' && displayObj.setStatus(_config.STATUS_ATTACK);
        }).on('hit', function () {
            _this._isCanAirJump = false;
        });
        return _this;
    }

    // @override


    (0, _createClass3["default"])(Ninja, [{
        key: 'handleKeys',
        value: function handleKeys() {
            var obj = this._displayObj;
            var keys = obj.getKeys();
            var composedForce = obj.getComposedForce();

            (0, _get3["default"])(Ninja.prototype.__proto__ || Object.getPrototypeOf(Ninja.prototype), 'handleKeys', this).call(this);

            if (composedForce.y == 0) {
                this._jumpCount = 0;
                this._isCanAirJump = false;
            }

            if (!keys[_config.KEY_JUMP] && composedForce.y != 0 && this._jumpCount == 0 && obj.getStatus() != _config.STATUS_HIT && obj.getStatus() != _config.STATUS_ATTACK) {
                this._isCanAirJump = true;
            }

            if (keys[_config.KEY_JUMP] && composedForce.y != 0 && this._isCanAirJump) {
                var vel = obj.getDir() == 'right' ? this._airJumpVelocity.clone() : this._airJumpVelocity.clone().invertX();

                this._jumpCount++;
                this._isCanAirJump = false;
                obj.addVelocity(vel);
            }
        }
    }]);
    return Ninja;
}(_Character3["default"]);

exports["default"] = Ninja;