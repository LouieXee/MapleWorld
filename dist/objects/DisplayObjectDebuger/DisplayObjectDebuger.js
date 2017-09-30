'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _PIXI = PIXI,
    Container = _PIXI.Container;


var LINE_HEIGHT = 20;
var FONT_SIZE = 12;

var DisplayObjectDebuger = function (_Container) {
    (0, _inherits3["default"])(DisplayObjectDebuger, _Container);

    function DisplayObjectDebuger(opt) {
        (0, _classCallCheck3["default"])(this, DisplayObjectDebuger);

        var _this = (0, _possibleConstructorReturn3["default"])(this, (DisplayObjectDebuger.__proto__ || Object.getPrototypeOf(DisplayObjectDebuger)).call(this));

        var displayObj = opt.displayObj,
            color = opt.color,
            _opt$textVisible = opt.textVisible,
            textVisible = _opt$textVisible === undefined ? false : _opt$textVisible,
            _opt$lineHeight = opt.lineHeight,
            lineHeight = _opt$lineHeight === undefined ? LINE_HEIGHT : _opt$lineHeight,
            _opt$fontSize = opt.fontSize,
            fontSize = _opt$fontSize === undefined ? FONT_SIZE : _opt$fontSize;


        _this._isTextVisible = textVisible;
        _this._displayObj = displayObj;
        _this._lineHeight = lineHeight;
        _this._textStyle = {
            fontSize: fontSize,
            lineHeight: lineHeight,
            fill: color
        };
        _this._texts = [];

        _this._texts.forEach(function (text) {
            text.visible = _this._isTextVisible;
        });
        return _this;
    }

    (0, _createClass3["default"])(DisplayObjectDebuger, [{
        key: 'toggleTextVisible',
        value: function toggleTextVisible() {
            var _this2 = this;

            this._isTextVisible = !this._isTextVisible;

            this._texts.forEach(function (text) {
                text.visible = _this2._isTextVisible;
            });
        }
    }, {
        key: 'addText',
        value: function addText() {
            var _this3 = this,
                _texts;

            var newTexts = Array.prototype.slice.call(arguments, 0);
            var currentLength = this._texts.length;

            newTexts.forEach(function (text, index) {
                text.x = -_this3._displayObj._width / 2;
                text.y = -_this3._displayObj._height - (currentLength + index + 1) * _this3._lineHeight;
                text.style = _this3._textStyle;
                text.visible = _this3._isTextVisible;
            });

            (_texts = this._texts).push.apply(_texts, (0, _toConsumableArray3["default"])(newTexts));
            this.addChild.apply(this, (0, _toConsumableArray3["default"])(newTexts));
        }
    }, {
        key: 'addTextAt',
        value: function addTextAt(text, index) {
            var _texts2,
                _this4 = this;

            if (!(0, _utils.isArray)(text)) {
                text = [text];
            }

            (_texts2 = this._texts).splice.apply(_texts2, [index, 0].concat((0, _toConsumableArray3["default"])(text)));

            this._texts.slice(index).forEach(function (text, i) {
                text.x = -_this4._displayObj._width / 2;
                text.y = -_this4._displayObj._height - (index + i + 1) * _this4._lineHeight;
                text.style = _this4._textStyle;
                text.visible = _this4._isTextVisible;
            });

            this.addChild.apply(this, (0, _toConsumableArray3["default"])(text));
        }
    }]);
    return DisplayObjectDebuger;
}(Container);

exports["default"] = DisplayObjectDebuger;