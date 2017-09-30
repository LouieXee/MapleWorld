'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Controller = function () {
    function Controller(target) {
        (0, _classCallCheck3["default"])(this, Controller);

        this.target = target;

        this._bind();
    }

    (0, _createClass3["default"])(Controller, [{
        key: '_bind',
        value: function _bind() {
            var _this = this;

            window.addEventListener('keydown', function (e) {
                _this.target.setKeys(e.keyCode, true);
            });

            window.addEventListener('keyup', function (e) {
                _this.target.setKeys(e.keyCode, false);
            });
        }
    }]);
    return Controller;
}();

exports["default"] = Controller;