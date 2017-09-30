'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Character2 = require('../Character');

var _Character3 = _interopRequireDefault(_Character2);

var _utils = require('../../utils');

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createAnimatedSprite = _Character3["default"].createAnimatedSprite;

var Snail = function (_Character) {
    (0, _inherits3["default"])(Snail, _Character);

    function Snail(displayObj) {
        var _animations;

        (0, _classCallCheck3["default"])(this, Snail);
        return (0, _possibleConstructorReturn3["default"])(this, (Snail.__proto__ || Object.getPrototypeOf(Snail)).call(this, displayObj, {
            width: 45,
            height: 35,
            maxMoveSpeed: 1,
            animations: (_animations = {}, (0, _defineProperty3["default"])(_animations, _config.STATUS_STAND, createAnimatedSprite('snail-stand')), (0, _defineProperty3["default"])(_animations, _config.STATUS_HIT, createAnimatedSprite('snail-hit')), (0, _defineProperty3["default"])(_animations, _config.STATUS_AIR, createAnimatedSprite('snail-jump')), (0, _defineProperty3["default"])(_animations, _config.STATUS_MOVE, createAnimatedSprite('snail-move', 4, { animationSpeed: 0.13 })), (0, _defineProperty3["default"])(_animations, _config.STATUS_DEAD, createAnimatedSprite('snail-die', 3, { animationSpeed: 0.09 })), _animations)
        }));
    }

    return Snail;
}(_Character3["default"]);

exports["default"] = Snail;