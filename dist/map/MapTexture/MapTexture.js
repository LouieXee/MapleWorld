'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _PIXI = PIXI,
    CanvasRenderer = _PIXI.CanvasRenderer,
    WebGLRenderer = _PIXI.WebGLRenderer,
    Rectangle = _PIXI.Rectangle,
    Sprite = _PIXI.Sprite,
    Container = _PIXI.Container,
    Texture = _PIXI.Texture;
var ParticleContainer = PIXI.particles.ParticleContainer;
var TilingSprite = PIXI.extras.TilingSprite;

var MapTexture = function (_Sprite) {
    (0, _inherits3["default"])(MapTexture, _Sprite);

    function MapTexture(type, textures) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        (0, _classCallCheck3["default"])(this, MapTexture);

        var _this = (0, _possibleConstructorReturn3["default"])(this, (MapTexture.__proto__ || Object.getPrototypeOf(MapTexture)).call(this));

        _this._type = type;
        _this._textures = textures;
        _this._opt = opt;
        _this._canvasCache = null;

        _this._handleTextureCache();
        return _this;
    }

    (0, _createClass3["default"])(MapTexture, [{
        key: 'toCanvas',
        value: function toCanvas() {
            if (this._canvasCache) {
                return this._canvasCache;
            }

            this._canvasCache = document.createElement('canvas');
            this.renderCanvas(new CanvasRenderer({
                width: this.children[0].width,
                height: this.children[0].height,
                view: this._canvasCache,
                transparent: true
            }));

            return this._canvasCache;
        }
    }, {
        key: '_handleTextureCache',
        value: function _handleTextureCache() {
            switch (this._type) {
                case 'ground':
                    return this._handleGroundTexture();
                case 'slope':
                    return this._handleSlopeTexture();
                case 'wall':
                    return this._handleWallTexture();
            }
        }
    }, {
        key: '_handleWallTexture',
        value: function _handleWallTexture() {
            var texture = this._textures.wall;
            var _opt = this._opt,
                _opt$size = _opt.size,
                size = _opt$size === undefined ? 1 : _opt$size,
                dir = _opt.dir,
                slopeGroundHeight = _opt.slopeGroundHeight;


            var tiling = new TilingSprite(texture, texture.width, size * texture.height);

            this.addChild(tiling);

            this.y = slopeGroundHeight;
            if (dir == 'left') {
                this.x = -texture.width;
            }
        }
    }, {
        key: '_handleSlopeTexture',
        value: function _handleSlopeTexture() {
            var texture = this._textures.slope;
            var _opt2 = this._opt,
                _opt2$size = _opt2.size,
                size = _opt2$size === undefined ? 1 : _opt2$size,
                _opt2$dir = _opt2.dir,
                dir = _opt2$dir === undefined ? 'left' : _opt2$dir,
                slopeGroundHeight = _opt2.slopeGroundHeight;

            var container = new Container();
            var getPositionByIndex = dir == 'left' ? function (i) {
                return [i * texture.width, (size - 1 - i) * (texture.height - slopeGroundHeight)];
            } : function (i) {
                return [i * texture.width, i * (texture.height - slopeGroundHeight)];
            };

            for (var i = 0; i < size; i++) {
                var slope = new Sprite(texture);

                var _getPositionByIndex = getPositionByIndex(i),
                    _getPositionByIndex2 = (0, _slicedToArray3["default"])(_getPositionByIndex, 2),
                    x = _getPositionByIndex2[0],
                    y = _getPositionByIndex2[1];

                slope.x = x;
                slope.y = y;

                container.addChild(slope);
            }

            this.addChild(container);
        }
    }, {
        key: '_handleGroundTexture',
        value: function _handleGroundTexture() {
            var textureGround = this._textures.ground;
            var textureEdge = this._textures.edge;
            var _opt3 = this._opt,
                _opt3$size = _opt3.size,
                size = _opt3$size === undefined ? 1 : _opt3$size,
                _opt3$edge = _opt3.edge,
                edge = _opt3$edge === undefined ? 'none' : _opt3$edge,
                deltaOfGroundAndSlope = _opt3.deltaOfGroundAndSlope;

            var container = new Container();
            var tiling = new TilingSprite(textureGround, size * textureGround.width, textureGround.height);

            container.addChild(tiling);

            if (edge == 'left') {
                textureEdge = textureEdge.clone();

                tiling.x = textureEdge.width / 2;
                textureEdge.frame = new Rectangle(0, 0, textureEdge.width / 2, textureEdge.height);

                container.addChild(new Sprite(textureEdge));
            } else if (edge == 'right') {
                textureEdge = textureEdge.clone();

                textureEdge.frame = new Rectangle(textureEdge.width / 2, 0, textureEdge.width / 2, textureEdge.height);

                var _edge = new Sprite(textureEdge);
                _edge.x = size * textureGround.width;

                container.addChild(_edge);
            } else if (edge == 'both') {
                var leftTexture = textureEdge.clone();
                var rightTexture = textureEdge.clone();

                leftTexture.frame = new Rectangle(0, 0, textureEdge.width / 2, textureEdge.height);
                rightTexture.frame = new Rectangle(textureEdge.width / 2, 0, textureEdge.width / 2, textureEdge.height);

                tiling.x = textureEdge.width / 2;

                var leftEdge = new Sprite(leftTexture);
                var rightEdge = new Sprite(rightTexture);

                rightEdge.x = textureEdge.width / 2 + size * textureGround.width;

                container.addChild(leftEdge);
                container.addChild(rightEdge);
            }

            this.addChild(container);
            this.y = deltaOfGroundAndSlope;
        }
    }]);
    return MapTexture;
}(Sprite);

exports["default"] = MapTexture;