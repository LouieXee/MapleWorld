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

var Wall = function (_MapTiles) {
    (0, _inherits3["default"])(Wall, _MapTiles);

    function Wall(opt) {
        (0, _classCallCheck3["default"])(this, Wall);
        var _opt$texture = opt.texture,
            texture = _opt$texture === undefined ? null : _opt$texture,
            _opt$size = opt.size,
            size = _opt$size === undefined ? 1 : _opt$size,
            height = opt.height,
            _opt$type = opt.type,
            type = _opt$type === undefined ? 'left' : _opt$type,
            _opt$wallHeight = opt.wallHeight,
            wallHeight = _opt$wallHeight === undefined ? _config.WALL_HEIGHT : _opt$wallHeight,
            _opt$groundHeight = opt.groundHeight,
            groundHeight = _opt$groundHeight === undefined ? _config.GROUND_HEIGHT : _opt$groundHeight,
            rest = (0, _objectWithoutProperties3["default"])(opt, ['texture', 'size', 'height', 'type', 'wallHeight', 'groundHeight']);
        return (0, _possibleConstructorReturn3["default"])(this, (Wall.__proto__ || Object.getPrototypeOf(Wall)).call(this, (0, _extends3["default"])({}, rest, {
            height: height || size * wallHeight,
            tilesType: type,
            lineFunction: function lineFunction(y) {
                return 0;
            },
            texture: texture && function () {
                var textureWall = TextureCache[texture];
                var mapTexture = new _MapTexture2["default"]('wall', {
                    wall: textureWall
                }, {
                    size: size,
                    type: type,
                    groundHeight: groundHeight
                }).getTexture();
                var sprite = new Sprite(mapTexture);

                type == 'left' && (sprite.x = -textureWall.width);

                return sprite;
            }()
        })));
    }

    return Wall;
}(_MapTiles3["default"]);

exports["default"] = Wall;