'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _stats = require('stats.js');

var _stats2 = _interopRequireDefault(_stats);

var _Store = require('./common/Store');

var _Store2 = _interopRequireDefault(_Store);

var _Controller = require('./common/Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _Player = require('./objects/Player');

var _Player2 = _interopRequireDefault(_Player);

var _Ninja = require('./characters/Ninja');

var _Ninja2 = _interopRequireDefault(_Ninja);

var _Map = require('./map/Map');

var _Map2 = _interopRequireDefault(_Map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Game = function () {
    function Game() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3["default"])(this, Game);
        var app = opt.app,
            mapConfig = opt.mapConfig,
            _opt$debug = opt.debug,
            debug = _opt$debug === undefined ? false : _opt$debug,
            _opt$showTexture = opt.showTexture,
            showTexture = _opt$showTexture === undefined ? true : _opt$showTexture;
        var stage = app.stage,
            view = app.view;


        this._app = app;
        this._mapConfig = mapConfig;
        this._debug = debug;
        this._showTexture = showTexture;

        this._player = this._createPlayer();
        this._currentMap = this._createMap(mapConfig);

        this._currentMap.addObject(this._player);
        stage.addChild(this._currentMap);

        _Store2["default"].setViewSize(view.width, view.height);

        this._start();
    }

    (0, _createClass3["default"])(Game, [{
        key: '_createPlayer',
        value: function _createPlayer() {
            var player = new _Player2["default"]({
                x: 100,
                y: 0,
                character: _Ninja2["default"],
                name: 'player',
                type: 'player',
                tag: 'player',
                debug: this._debug
            });

            new _Controller2["default"](player);

            return player;
        }
    }, {
        key: '_createMap',
        value: function _createMap(mapConfig) {
            var map = new _Map2["default"]((0, _extends3["default"])({
                debug: this._debug,
                showTexture: this._showTexture
            }, mapConfig));

            return map;
        }
    }, {
        key: '_start',
        value: function _start() {
            var _this = this;

            var ticker = this._app.ticker;


            if (this._debug) {
                var stats = new _stats2["default"]();
                document.body.appendChild(stats.dom);

                ticker.add(function () {
                    stats.begin();

                    _this._currentMap.update();

                    stats.end();
                });
            } else {
                ticker.add(function () {
                    _this._currentMap.update();
                });
            }
        }
    }]);
    return Game;
}();

exports["default"] = Game;