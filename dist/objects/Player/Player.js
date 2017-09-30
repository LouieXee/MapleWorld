'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DisplayObject2 = require('../DisplayObject');

var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Player = function (_DisplayObject) {
    (0, _inherits3["default"])(Player, _DisplayObject);

    function Player(opt) {
        (0, _classCallCheck3["default"])(this, Player);
        return (0, _possibleConstructorReturn3["default"])(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, opt));
    }

    return Player;
}(_DisplayObject3["default"]);

exports["default"] = Player;