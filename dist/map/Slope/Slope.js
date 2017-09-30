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

var _MapTexture = require('../MapTexture');

var _MapTexture2 = _interopRequireDefault(_MapTexture);

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _PIXI = PIXI,
    Sprite = _PIXI.Sprite;
var TextureCache = PIXI.utils.TextureCache;

var Slope = function (_MapTiles) {
    (0, _inherits3["default"])(Slope, _MapTiles);

    function Slope(opt) {
        (0, _classCallCheck3["default"])(this, Slope);
        var _opt$texture = opt.texture,
            texture = _opt$texture === undefined ? null : _opt$texture,
            _opt$size = opt.size,
            size = _opt$size === undefined ? 1 : _opt$size,
            _opt$type = opt.type,
            type = _opt$type === undefined ? 'left' : _opt$type,
            _opt$slopeWidth = opt.slopeWidth,
            slopeWidth = _opt$slopeWidth === undefined ? _config.SLOPE_WIDTH : _opt$slopeWidth,
            _opt$slopeHeight = opt.slopeHeight,
            slopeHeight = _opt$slopeHeight === undefined ? _config.SLOPE_HEIGHT : _opt$slopeHeight,
            _opt$deltaHeight = opt.deltaHeight,
            deltaHeight = _opt$deltaHeight === undefined ? _config.SLOPE_GROUND_DELTA : _opt$deltaHeight,
            _opt$leftFunction = opt.leftFunction,
            leftFunction = _opt$leftFunction === undefined ? function (x) {
            return _config.SLOPE_LEFT_VALUE * x;
        } : _opt$leftFunction,
            _opt$rightFunction = opt.rightFunction,
            rightFunction = _opt$rightFunction === undefined ? function (x) {
            return _config.SLOPE_RIGHT_VALUE * x;
        } : _opt$rightFunction,
            rest = (0, _objectWithoutProperties3["default"])(opt, ['texture', 'size', 'type', 'slopeWidth', 'slopeHeight', 'deltaHeight', 'leftFunction', 'rightFunction']);
        return (0, _possibleConstructorReturn3["default"])(this, (Slope.__proto__ || Object.getPrototypeOf(Slope)).call(this, (0, _extends3["default"])({}, rest, {
            width: size * slopeWidth,
            height: size * (slopeHeight - deltaHeight),
            tilesType: 'bottom',
            lineFunction: type == 'left' ? function (x) {
                return leftFunction(x) + size * (slopeHeight - deltaHeight);
            } : rightFunction,
            texture: texture && new Sprite(new _MapTexture2["default"]('slope', {
                slope: TextureCache[texture]
            }, {
                size: size,
                type: type,
                deltaHeight: deltaHeight
            }).getTexture())
        })));
    }

    return Slope;
}(_MapTiles3["default"]);

exports["default"] = Slope;