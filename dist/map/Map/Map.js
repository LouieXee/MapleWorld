'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Store = require('../../common/Store');

var _Store2 = _interopRequireDefault(_Store);

var _utils = require('../../utils');

var _Robot = require('../../objects/Robot');

var _Robot2 = _interopRequireDefault(_Robot);

var _Ground = require('../Ground');

var _Ground2 = _interopRequireDefault(_Ground);

var _Slope = require('../Slope');

var _Slope2 = _interopRequireDefault(_Slope);

var _Wall = require('../Wall');

var _Wall2 = _interopRequireDefault(_Wall);

var _Ceiling = require('../Ceiling');

var _Ceiling2 = _interopRequireDefault(_Ceiling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _PIXI = PIXI,
    Container = _PIXI.Container,
    Graphics = _PIXI.Graphics;

var Map = function (_Container) {
    (0, _inherits3["default"])(Map, _Container);

    function Map() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3["default"])(this, Map);

        var _this = (0, _possibleConstructorReturn3["default"])(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this));

        var _opt$width = opt.width,
            width = _opt$width === undefined ? 0 : _opt$width,
            _opt$height = opt.height,
            height = _opt$height === undefined ? 0 : _opt$height,
            _opt$debug = opt.debug,
            debug = _opt$debug === undefined ? false : _opt$debug,
            _opt$showTexture = opt.showTexture,
            showTexture = _opt$showTexture === undefined ? true : _opt$showTexture,
            _opt$grounds = opt.grounds,
            grounds = _opt$grounds === undefined ? [] : _opt$grounds,
            _opt$slopes = opt.slopes,
            slopes = _opt$slopes === undefined ? [] : _opt$slopes,
            _opt$walls = opt.walls,
            walls = _opt$walls === undefined ? [] : _opt$walls,
            _opt$ceilings = opt.ceilings,
            ceilings = _opt$ceilings === undefined ? [] : _opt$ceilings,
            _opt$robots = opt.robots,
            robots = _opt$robots === undefined ? [] : _opt$robots;


        _this._width = width;
        _this._height = height;

        _this._verticalTiles = [];
        _this._horizantolTiles = [];
        _this._objects = [];
        _this._player = null;

        _this._debug = debug;
        _this._showTexture = showTexture;

        _this._createTiles({
            grounds: grounds,
            slopes: slopes,
            walls: [].concat((0, _toConsumableArray3["default"])(walls), [{
                x: 0,
                y: 0,
                height: height,
                type: 'right'
            }, {
                x: width,
                y: 0,
                height: height,
                type: 'left'
            }]),
            ceilings: [].concat((0, _toConsumableArray3["default"])(ceilings), [{
                x: 0,
                y: 0,
                width: width
            }])
        });
        _this._createRobots(robots);
        _this._locateMap();

        debug && _this._setDebugMode();
        return _this;
    }

    (0, _createClass3["default"])(Map, [{
        key: '_setDebugMode',
        value: function _setDebugMode() {
            var rectangle = new Graphics();

            rectangle.lineStyle(1, 0xFF0000, 1);
            rectangle.drawRect(0, 0, this._width, this._height);

            this.addChild(rectangle);
        }
    }, {
        key: '_locateMap',
        value: function _locateMap() {
            var viewSize = _Store2["default"].getViewSize();

            if (viewSize.width > this._width) {
                this.x = (viewSize.width - this._width) / 2;
            }

            if (viewSize.height > this._height) {
                this.y = (viewSize.height - this._height) / 2;
            }
        }
    }, {
        key: '_createTiles',
        value: function _createTiles(_ref) {
            var grounds = _ref.grounds,
                slopes = _ref.slopes,
                walls = _ref.walls,
                ceilings = _ref.ceilings;

            var debug = this._debug;
            var showTexture = this._showTexture;

            grounds = grounds.map(function (ground) {
                return new _Ground2["default"]((0, _extends3["default"])({}, ground, {
                    debug: debug,
                    showTexture: showTexture
                }));
            });
            slopes = slopes.map(function (slope) {
                return new _Slope2["default"]((0, _extends3["default"])({}, slope, {
                    debug: debug,
                    showTexture: showTexture
                }));
            });
            walls = walls.map(function (wall) {
                return new _Wall2["default"]((0, _extends3["default"])({}, wall, {
                    debug: debug,
                    showTexture: showTexture
                }));
            });
            ceilings = ceilings.map(function (ceiling) {
                return new _Ceiling2["default"]((0, _extends3["default"])({}, ceiling, {
                    debug: debug,
                    showTexture: showTexture
                }));
            });

            this._verticalTiles = [].concat((0, _toConsumableArray3["default"])(grounds), (0, _toConsumableArray3["default"])(slopes), (0, _toConsumableArray3["default"])(ceilings));
            this._horizantolTiles = [].concat((0, _toConsumableArray3["default"])(walls));
            this.addChild.apply(this, (0, _toConsumableArray3["default"])(grounds).concat((0, _toConsumableArray3["default"])(slopes), (0, _toConsumableArray3["default"])(walls), (0, _toConsumableArray3["default"])(ceilings)));
        }
    }, {
        key: '_createRobots',
        value: function _createRobots(robots) {
            var _objects;

            var debug = this._debug;
            var showTexture = this._showTexture;
            var robotInstances = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = robots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var robot = _step.value;

                    var characterCreater = _Store2["default"].getCharacter(robot.character);

                    if (!characterCreater) {
                        continue;
                    }

                    robotInstances.push(new _Robot2["default"]((0, _extends3["default"])({}, robot, {
                        debug: debug,
                        showTexture: showTexture,
                        character: characterCreater
                    })));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            (_objects = this._objects).push.apply(_objects, robotInstances);
            this.addChild.apply(this, robotInstances);
        }
    }, {
        key: '_followPlayer',
        value: function _followPlayer(player) {
            var viewSize = _Store2["default"].getViewSize();

            if (viewSize.width < this._width) {
                var expectedX = viewSize.width / 2 - player.position.x;

                expectedX > 0 && (expectedX = 0);
                expectedX < viewSize.width - this._width && (expectedX = viewSize.width - this._width);

                this.x = expectedX;
            }

            if (viewSize.height < this._height) {
                var expectedY = viewSize.height / 2 - player.position.y;

                expectedY > 0 && (expectedY = 0);
                expectedY < viewSize.height - this._height && (expectedY = viewSize.height - this._height);

                this.y = expectedY;
            }
        }
    }, {
        key: 'addObject',
        value: function addObject() {
            var _objects2;

            var args = Array.prototype.slice.call(arguments, 0);

            (_objects2 = this._objects).push.apply(_objects2, (0, _toConsumableArray3["default"])(args));
            this.addChild.apply(this, (0, _toConsumableArray3["default"])(args));

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = args[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var obj = _step2.value;

                    if (obj.getName() == 'player') {
                        this._player = obj;

                        break;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this;
        }
    }, {
        key: 'removeObject',
        value: function removeObject() {}
    }, {
        key: 'getObjects',
        value: function getObjects(filter) {
            if ((0, _utils.isFunction)(filter)) {
                return this._objects.filter(filter);
            }

            return this._objects;
        }
    }, {
        key: 'getObjectsById',
        value: function getObjectsById(id) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._objects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var obj = _step3.value;

                    if (obj.getId() == id) {
                        return obj;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                        _iterator3["return"]();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return null;
        }
    }, {
        key: 'getObjectsByName',
        value: function getObjectsByName(name) {
            return this._objects.filter(function (obj) {
                return obj.getName() == name;
            });
        }
    }, {
        key: 'getObjectsByType',
        value: function getObjectsByType(type) {
            return this._objects.filter(function (obj) {
                return obj.getType() == type;
            });
        }
    }, {
        key: 'getObjectsByTag',
        value: function getObjectsByTag(tag) {
            return this._objects.filter(function (obj) {
                return obj.getTag() == tag;
            });
        }
    }, {
        key: 'update',
        value: function update() {
            this._player && this._followPlayer(this._player);

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._objects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var obj = _step4.value;
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = this._horizantolTiles[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var horizantolTile = _step5.value;

                            if (horizantolTile.check(obj)) {
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
                                _iterator5["return"]();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = this._verticalTiles[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var verticalTile = _step6.value;

                            if (verticalTile.check(obj)) {
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError6 = true;
                        _iteratorError6 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                                _iterator6["return"]();
                            }
                        } finally {
                            if (_didIteratorError6) {
                                throw _iteratorError6;
                            }
                        }
                    }

                    obj.update();
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                        _iterator4["return"]();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }]);
    return Map;
}(Container);

exports["default"] = Map;