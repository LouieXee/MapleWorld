export function isArray (target) {
    return _getType(target) == '[object Array]';
};

export function isFunction (target) {
    return _getType(target) == '[object Function]';
}

export function isString (target) {
    return _getType(target) == '[object String]';
}

export function isNumber (target) {
    return _getType(target) == '[object Number]';
}

export function getUniqueId () {
    return `${new Date().getTime().toString(16).toUpperCase()}-${(Math.random() * 1e17).toString(16).toUpperCase()}`;
}

function _getType (target) {
    return Object.prototype.toString.call(target);
}
