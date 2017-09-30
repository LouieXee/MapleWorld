'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isNumber = isNumber;
exports.getUniqueId = getUniqueId;
exports.testRectangleHit = testRectangleHit;
function isArray(target) {
    return _getType(target) == '[object Array]';
};

function isFunction(target) {
    return _getType(target) == '[object Function]';
}

function isString(target) {
    return _getType(target) == '[object String]';
}

function isNumber(target) {
    return _getType(target) == '[object Number]';
}

function getUniqueId() {
    return new Date().getTime().toString(16).toUpperCase() + '-' + (Math.random() * 1e17).toString(16).toUpperCase();
}

function testRectangleHit(r1, r2) {
    if (Math.abs(r1.x + r1.width / 2 - (r2.x + r2.width / 2)) < r1.width / 2 + r2.width / 2 && Math.abs(r1.y + r1.height / 2 - (r2.y + r2.height / 2)) < r1.height / 2 + r2.height / 2) {
        return true;
    }

    return false;
}

function _getType(target) {
    return Object.prototype.toString.call(target);
}