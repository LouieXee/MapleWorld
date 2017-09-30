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

var Ground = function (_MapTiles) {
    (0, _inherits3["default"])(Ground, _MapTiles);

    function Ground(opt) {
        (0, _classCallCheck3["default"])(this, Ground);
        var _opt$texture = opt.texture,
            texture = _opt$texture === undefined ? null : _opt$texture,
            _opt$edgeTexture = opt.edgeTexture,
            edgeTexture = _opt$edgeTexture === undefined ? null : _opt$edgeTexture,
            _opt$edge = opt.edge,
            edge = _opt$edge === undefined ? 'none' : _opt$edge,
            _opt$size = opt.size,
            size = _opt$size === undefined ? 1 : _opt$size,
            _opt$groundWidth = opt.groundWidth,
            groundWidth = _opt$groundWidth === undefined ? _config.GROUND_WIDTH : _opt$groundWidth,
            _opt$groundHeight = opt.groundHeight,
            groundHeight = _opt$groundHeight === undefined ? _config.GROUND_HEIGHT : _opt$groundHeight,
            _opt$edgeWidth = opt.edgeWidth,
            edgeWidth = _opt$edgeWidth === undefined ? _config.GROUND_EDGE_WIDTH : _opt$edgeWidth,
            _opt$deltaOfGroundAnd = opt.deltaOfGroundAndSlope,
            deltaOfGroundAndSlope = _opt$deltaOfGroundAnd === undefined ? _config.SLOPE_GROUND_HEIGHT - _config.GROUND_HEIGHT : _opt$deltaOfGroundAnd,
            rest = (0, _objectWithoutProperties3["default"])(opt, ['texture', 'edgeTexture', 'edge', 'size', 'groundWidth', 'groundHeight', 'edgeWidth', 'deltaOfGroundAndSlope']);
        return (0, _possibleConstructorReturn3["default"])(this, (Ground.__proto__ || Object.getPrototypeOf(Ground)).call(this, (0, _extends3["default"])({}, rest, {
            width: size * groundWidth + ((edge == 'left' || edge == 'right') && edgeWidth / 2 || edge == 'both' && edgeWidth || 0),
            tilesType: 'bottom',
            lineFunction: function lineFunction(x) {
                return 0;
            },
            texture: texture && new Sprite(new _MapTexture2["default"]('ground', {
                ground: TextureCache[texture],
                edge: TextureCache[edgeTexture]
            }, {
                size: size,
                edge: edge,
                deltaOfGroundAndSlope: deltaOfGroundAndSlope
            }).getTexture())
        })));
    }

    return Ground;
}(_MapTiles3["default"]);

exports["default"] = Ground;