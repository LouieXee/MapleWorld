import { Events } from '../../utils';

// 全局储存的数据
class Store {

    constructor () {
        this._viewSize = {
            width: 0,
            height: 0
        };
        this._charactersCache = {};
    }

    registerCharacter (key, character) {
        this._charactersCache[key] = character;

        return this;
    }

    getCharacter (key) {
        return this._charactersCache[key];
    }

    setViewSize (width, height) {
        this._viewSize = {
            width,
            height
        };

        return this;
    }

    getViewSize () {
        return this._viewSize;
    }

}

export default new Store();
