'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _PIXI = PIXI,
    autoDetectRenderer = _PIXI.autoDetectRenderer,
    Rectangle = _PIXI.Rectangle,
    Sprite = _PIXI.Sprite,
    Container = _PIXI.Container,
    Texture = _PIXI.Texture;
var ParticleContainer = PIXI.particles.ParticleContainer;
var TilingSprite = PIXI.extras.TilingSprite;

var MapTexture = function () {
    function MapTexture(type, textures) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        (0, _classCallCheck3["default"])(this, MapTexture);

        this._type = type;
        this._textures = textures;
        this._opt = opt;
        this._textureCache = document.createElement('canvas');

        this._stage = new Container();
        this._renderer = autoDetectRenderer({
            width: 0,
            height: 0,
            view: this._textureCache,
            transparent: true
        });
        this._renderer.autoResize = true;

        this._handleTextureCache();
    }

    (0, _createClass3["default"])(MapTexture, [{
        key: 'updateOptions',
        value: function updateOptions(opt) {
            this._opt = (0, _extends3["default"])({}, opt, this._opt);

            this._handleTextureCache();

            return this;
        }
    }, {
        key: 'getTexture',
        value: function getTexture() {
            return Texture.from(this._textureCache);
        }
    }, {
        key: 'getCanvas',
        value: function getCanvas() {
            return this._textureCache;
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
            var stage = this._stage;
            var renderer = this._renderer;
            var texture = this._textures.wall;
            var _opt = this._opt,
                _opt$size = _opt.size,
                size = _opt$size === undefined ? 1 : _opt$size,
                _opt$type = _opt.type,
                type = _opt$type === undefined ? 'left' : _opt$type,
                groundHeight = _opt.groundHeight;


            renderer.resize(texture.width, size * texture.height + groundHeight);
            stage.removeChildren();

            var tiling = new TilingSprite(texture, texture.width, size * texture.height);

            tiling.y = groundHeight;

            stage.addChild(tiling);
            renderer.render(stage);
        }
    }, {
        key: '_handleSlopeTexture',
        value: function _handleSlopeTexture() {
            var stage = this._stage;
            var renderer = this._renderer;
            var texture = this._textures.slope;
            var _opt2 = this._opt,
                _opt2$size = _opt2.size,
                size = _opt2$size === undefined ? 1 : _opt2$size,
                _opt2$type = _opt2.type,
                type = _opt2$type === undefined ? 'left' : _opt2$type,
                deltaHeight = _opt2.deltaHeight;

            var container = new ParticleContainer();
            var getPositionByIndex = type == 'left' ? function (i) {
                return [i * texture.width, (size - 1 - i) * (texture.height - deltaHeight)];
            } : function (i) {
                return [i * texture.width, i * (texture.height - deltaHeight)];
            };

            renderer.resize(size * texture.width, size * (texture.height - deltaHeight) + deltaHeight);
            stage.removeChildren();

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

            stage.addChild(container);
            renderer.render(stage);
        }
    }, {
        key: '_handleGroundTexture',
        value: function _handleGroundTexture() {
            var stage = this._stage;
            var renderer = this._renderer;
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

            renderer.resize(size * textureGround.width + ((edge == 'left' || edge == 'right') && textureEdge.width / 2 || edge == 'both' && textureEdge.width || 0), textureGround.height);

            stage.removeChildren();

            container.addChild(tiling);
            container.y = deltaOfGroundAndSlope;

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

            stage.addChild(container);
            renderer.render(stage);
        }
    }]);
    return MapTexture;
}();

exports["default"] = MapTexture;