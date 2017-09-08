import { getUniqueId, isString, isFunction } from './common';

export class Events {

    constructor () {
        this._events = {};
    }

    on (eventName, callback) {
        if (!this._events[eventName]) {
            this._events[eventName] = {};
        }

        this._events[eventName][getUniqueId()] = callback;

        return this;
    }

    off (eventName, callback) {
        if (!isString(eventName)) {
            this._events = {};
            return this;
        }

        if (!this._events[eventName]) {
            return this;
        }

        if (!isFunction(callback)) {
            this._events[eventName] = {};
            return this;
        }

        let cache = this._events[eventName];
        for (let name in cache) {
            if (cache[name] === callback) {
                delete cache[name];
                return this;
            }
        }
    }

    emit (eventName) {
        if (!this._events[eventName]) {
            return this;
        }

        let args = Array.prototype.slice.call(arguments, 1);
        let cache = this._events[eventName];

        for (let name in cache) {
            cache[name].apply(this, args);
        }

        return this;
    }

}
