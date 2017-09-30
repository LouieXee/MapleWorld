'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
    Sprite = _PIXI.Sprite,
    Graphics = _PIXI.Graphics,
    Texture = _PIXI.Texture;


var DELTA = .1;

var MapTiles = function (_Sprite) {
    (0, _inherits3["default"])(MapTiles, _Sprite);

    function MapTiles(opt) {
        (0, _classCallCheck3["default"])(this, MapTiles);

        var _this2 = (0, _possibleConstructorReturn3["default"])(this, (MapTiles.__proto__ || Object.getPrototypeOf(MapTiles)).call(this));

        var texture = opt.texture,
            _opt$x = opt.x,
            x = _opt$x === undefined ? 0 : _opt$x,
            _opt$y = opt.y,
            y = _opt$y === undefined ? 0 : _opt$y,
            _opt$width = opt.width,
            width = _opt$width === undefined ? 0 : _opt$width,
            _opt$height = opt.height,
            height = _opt$height === undefined ? 0 : _opt$height,
            _opt$tilesType = opt.tilesType,
            tilesType = _opt$tilesType === undefined ? 'bottom' : _opt$tilesType,
            _opt$friction = opt.friction,
            friction = _opt$friction === undefined ? .8 : _opt$friction,
            _opt$debug = opt.debug,
            debug = _opt$debug === undefined ? false : _opt$debug,
            _opt$showTexture = opt.showTexture,
            showTexture = _opt$showTexture === undefined ? true : _opt$showTexture,
            _opt$lineFunction = opt.lineFunction,
            lineFunction = _opt$lineFunction === undefined ? function (x) {
            return 0;
        } : _opt$lineFunction;


        _this2.x = x;
        _this2.y = y;
        _this2._width = width;
        _this2._height = height;
        _this2._tilesType = tilesType;
        _this2._friction = friction;
        _this2._lineFunction = lineFunction;

        _this2._forcesKey = (tilesType == 'bottom' || tilesType == 'top') && 'vertical-pressure' || (tilesType == 'left' || tilesType == 'right') && 'horizontal-pressure';

        _this2._debug = debug;

        showTexture && texture && _this2.addChild(texture);
        debug && _this2._setDebugMode();
        return _this2;
    }

    (0, _createClass3["default"])(MapTiles, [{
        key: '_setDebugMode',
        value: function _setDebugMode() {
            var COLOR = 0xFF0000;

            var line = new Graphics();

            line.lineStyle(1, COLOR, 1);
            line.moveTo(0, this._lineFunction(0));

            if (this._tilesType == 'top' || this._tilesType == 'bottom') {
                line.lineTo(this._width, this._lineFunction(this._width));
            } else if (this._tilesType == 'left' || this._tilesType == 'right') {
                line.lineTo(this._lineFunction(this._height), this._height);
            }

            this.addChild(line);
        }
    }, {
        key: '_handleFriction',
        value: function _handleFriction(obj) {
            if (obj.hasForce('friction') && (obj.getVelocity().x == 0 || obj.getVelocity().x * obj.getLastVelocity().x < 0)) {
                // 摩擦力作用使速度降到0，同时移除摩擦力
                obj.removeForce('friction');
                obj.setVelocityX(0);
            } else if (!obj.hasForce('friction') && (obj.getVelocity().x != 0 || obj.getComposedForce().x != 0)) {
                // 当物体受力则添加摩擦力
                var frictionX = obj.getComposedForce().x == 0 ? obj.getWeight() * this._friction : Math.min(Math.abs(obj.getComposedForce().x), obj.getWeight() * this._friction);

                obj.addForce('friction', (obj.getVelocity().x > 0 ? -1 : 1) * frictionX, 0, 'horizontal');
            }
        }
    }, {
        key: 'check',
        value: function check(obj) {
            var _this = this;
            var forcesKey = this._forcesKey;

            if (this._tilesType == 'bottom' && obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y >= 0) {
                var _getBasicData2 = _getBasicData(forcesKey),
                    localLastPoint = _getBasicData2.localLastPoint,
                    localCurrentPoint = _getBasicData2.localCurrentPoint,
                    lastTargetValue = _getBasicData2.lastTargetValue,
                    currentTargetValue = _getBasicData2.currentTargetValue,
                    delta = _getBasicData2.delta;

                if (localLastPoint.y <= lastTargetValue + delta && localCurrentPoint.y >= currentTargetValue - delta) {
                    _handleObj(forcesKey, localCurrentPoint, currentTargetValue);

                    this._handleFriction(obj);

                    return true;
                }
            } else if (this._tilesType == 'top' && obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y <= 0) {
                var _getBasicData3 = _getBasicData(forcesKey),
                    _localLastPoint = _getBasicData3.localLastPoint,
                    _localCurrentPoint = _getBasicData3.localCurrentPoint,
                    _lastTargetValue = _getBasicData3.lastTargetValue,
                    _currentTargetValue = _getBasicData3.currentTargetValue,
                    _delta = _getBasicData3.delta;

                var objHeight = obj.getHeight();

                if (_localLastPoint.y - objHeight >= _lastTargetValue - _delta && _localCurrentPoint.y - objHeight <= _currentTargetValue + _delta) {
                    _handleObj(forcesKey, _localCurrentPoint, _currentTargetValue + objHeight);

                    return true;
                }
            } else if (this._tilesType == 'left' && obj.y > this.y && obj.y <= this.y + this._height && obj.getVelocity().x >= 0) {
                // 横向的默认为墙，则去除上边界的判断
                var _getBasicData4 = _getBasicData(forcesKey),
                    _localLastPoint2 = _getBasicData4.localLastPoint,
                    _localCurrentPoint2 = _getBasicData4.localCurrentPoint,
                    _lastTargetValue2 = _getBasicData4.lastTargetValue,
                    _currentTargetValue2 = _getBasicData4.currentTargetValue,
                    _delta2 = _getBasicData4.delta;

                if (_localLastPoint2.x <= _lastTargetValue2 + _delta2 && _localCurrentPoint2.x >= _currentTargetValue2 - _delta2) {
                    _handleObj(forcesKey, _localCurrentPoint2, _currentTargetValue2);

                    return true;
                }
            } else if (this._tilesType == 'right' && obj.y > this.y && obj.y <= this.y + this._height && obj.getVelocity().x <= 0) {
                // 横向的默认为墙，则去除上边界的判断
                var _getBasicData5 = _getBasicData(forcesKey),
                    _localLastPoint3 = _getBasicData5.localLastPoint,
                    _localCurrentPoint3 = _getBasicData5.localCurrentPoint,
                    _lastTargetValue3 = _getBasicData5.lastTargetValue,
                    _currentTargetValue3 = _getBasicData5.currentTargetValue,
                    _delta3 = _getBasicData5.delta;

                if (_localLastPoint3.x >= _lastTargetValue3 - _delta3 && _localCurrentPoint3.x <= _currentTargetValue3 + _delta3) {
                    _handleObj(forcesKey, _localCurrentPoint3, _currentTargetValue3);

                    return true;
                }
            }

            obj.removeForce(forcesKey);

            return false;

            function _getBasicData(type) {
                var localLastPoint = _this.toLocal(obj.getLastPoint(), _this.parent);
                var localCurrentPoint = _this.toLocal(obj.position, _this.parent);
                var lastTargetValue = _this._lineFunction(type == 'vertical-pressure' ? localLastPoint.x : localLastPoint.y);
                var currentTargetValue = _this._lineFunction(type == 'vertical-pressure' ? localCurrentPoint.x : localCurrentPoint.y);
                /*
                    1. 因为toLocal和toGlobal的转化会有小数点后数位的差异
                    2. 上坡处理
                    3. 下坡处理
                      所以在最后比较时会有一个上下浮动
                */
                var delta = obj.getVelocity().length() + DELTA;

                return {
                    localLastPoint: localLastPoint,
                    localCurrentPoint: localCurrentPoint,
                    lastTargetValue: lastTargetValue,
                    currentTargetValue: currentTargetValue,
                    delta: delta
                };
            }

            function _handleObj(type, localCurrentPoint, targetValue) {
                var composedForce = obj.getComposedForce();

                if (type == 'vertical-pressure') {
                    if (_this._tilesType == 'top' && composedForce.y < 0 || _this._tilesType == 'bottom' && composedForce.y > 0) {
                        obj.addForce(type, 0, -composedForce.y, 'vertical');
                    }

                    obj.setVelocityY(0);

                    localCurrentPoint.y = targetValue;
                    obj.y = _this.parent.toLocal(localCurrentPoint, _this).y;
                } else if (type == 'horizontal-pressure') {
                    if (_this._tilesType == 'left' && composedForce.x > 0 || _this._tilesType == 'right' && composedForce.x < 0) {
                        obj.addForce(type, -composedForce.x, 0, 'horizontal');
                    }

                    obj.setVelocityX(0);

                    localCurrentPoint.x = targetValue;
                    obj.x = _this.parent.toLocal(localCurrentPoint, _this).x;
                }
            }
        }
    }]);
    return MapTiles;
}(Sprite);

exports["default"] = MapTiles;