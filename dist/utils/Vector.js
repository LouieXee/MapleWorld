'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Vector = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Vector = function () {
    function Vector(x, y) {
        (0, _classCallCheck3["default"])(this, Vector);

        this.x = x;
        this.y = y;
        this._tag = 'none';
    }

    (0, _createClass3["default"])(Vector, [{
        key: 'setTag',
        value: function setTag(tag) {
            this._tag = tag;

            return this;
        }
    }, {
        key: 'getTag',
        value: function getTag() {
            return this._tag;
        }
    }, {
        key: 'add',
        value: function add(vector) {
            this.x += vector.x;
            this.y += vector.y;

            return this;
        }
    }, {
        key: 'sub',
        value: function sub(vector) {
            this.x -= vector.x;
            this.y -= vector.y;

            return this;
        }
    }, {
        key: 'mul',
        value: function mul(num) {
            this.x *= num;
            this.y *= num;

            return this;
        }
    }, {
        key: 'div',
        value: function div(num) {
            this.x /= num;
            this.y /= num;

            return this;
        }
    }, {
        key: 'invertX',
        value: function invertX() {
            this.x = -this.x;

            return this;
        }
    }, {
        key: 'invertY',
        value: function invertY() {
            this.y = -this.y;

            return this;
        }
    }, {
        key: 'length',
        value: function length(_length) {
            if (!(0, _common.isNumber)(_length)) {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }

            var nowLength = this.length();

            this.x *= _length / nowLength;
            this.y *= _length / nowLength;

            return this;
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new Vector(this.x, this.y).setTag(this._tag);
        }
    }]);
    return Vector;
}();

exports.Vector = Vector;