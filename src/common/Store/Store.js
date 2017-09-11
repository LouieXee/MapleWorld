import { Events } from '../../utils';

// 全局储存的数据
class Store {

    constructor () {
        this._viewSize = {
            width: 0,
            height: 0
        };
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
