'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Events = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Events = exports.Events = function () {
    function Events() {
        (0, _classCallCheck3["default"])(this, Events);

        this._events = {};
    }

    (0, _createClass3["default"])(Events, [{
        key: 'on',
        value: function on(eventName, callback) {
            if (!this._events[eventName]) {
                this._events[eventName] = {};
            }

            this._events[eventName][(0, _common.getUniqueId)()] = callback;

            return this;
        }
    }, {
        key: 'off',
        value: function off(eventName, callback) {
            if (!(0, _common.isString)(eventName)) {
                this._events = {};
                return this;
            }

            if (!this._events[eventName]) {
                return this;
            }

            if (!(0, _common.isFunction)(callback)) {
                this._events[eventName] = {};
                return this;
            }

            var cache = this._events[eventName];
            for (var name in cache) {
                if (cache[name] === callback) {
                    delete cache[name];
                    return this;
                }
            }
        }
    }, {
        key: 'emit',
        value: function emit(eventName) {
            if (!this._events[eventName]) {
                return this;
            }

            var args = Array.prototype.slice.call(arguments, 1);
            var cache = this._events[eventName];

            for (var name in cache) {
                cache[name].apply(this, args);
            }

            return this;
        }
    }]);
    return Events;
}();