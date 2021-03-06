'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _MapTiles2 = require('../MapTiles');

var _MapTiles3 = _interopRequireDefault(_MapTiles2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Ceiling = function (_MapTiles) {
    (0, _inherits3["default"])(Ceiling, _MapTiles);

    function Ceiling(opt) {
        (0, _classCallCheck3["default"])(this, Ceiling);
        var _opt$texture = opt.texture,
            texture = _opt$texture === undefined ? null : _opt$texture,
            rest = (0, _objectWithoutProperties3["default"])(opt, ['texture']);
        return (0, _possibleConstructorReturn3["default"])(this, (Ceiling.__proto__ || Object.getPrototypeOf(Ceiling)).call(this, (0, _extends3["default"])({}, rest, {
            tilesType: 'top',
            lineFunction: function lineFunction(x) {
                return 0;
            }
        })));
    }

    return Ceiling;
}(_MapTiles3["default"]);

exports["default"] = Ceiling;