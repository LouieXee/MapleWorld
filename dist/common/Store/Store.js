'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 全局储存的数据
var Store = function () {
    function Store() {
        (0, _classCallCheck3["default"])(this, Store);

        this._viewSize = {
            width: 0,
            height: 0
        };
        this._charactersCache = {};
    }

    (0, _createClass3["default"])(Store, [{
        key: 'registerCharacter',
        value: function registerCharacter(key, character) {
            this._charactersCache[key] = character;

            return this;
        }
    }, {
        key: 'getCharacter',
        value: function getCharacter(key) {
            return this._charactersCache[key];
        }
    }, {
        key: 'setViewSize',
        value: function setViewSize(width, height) {
            this._viewSize = {
                width: width,
                height: height
            };

            return this;
        }
    }, {
        key: 'getViewSize',
        value: function getViewSize() {
            return this._viewSize;
        }
    }]);
    return Store;
}();

exports["default"] = new Store();