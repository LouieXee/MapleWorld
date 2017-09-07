import { KEY_MOVE_LEFT, KEY_MOVE_UP, KEY_MOVE_RIGHT, KEY_MOVE_DOWN, KEY_JUMP, KEY_ATTACK } from '../../config';

export default class Character {

    constructor (opt = {}) {
        const {
            width = 60,
            height = 100,
            weight = 1
        } = opt;

        this.width = width;
        this.height = height;
        this.weight = weight;
    }

    handleKeys (obj) {
        let keys = obj._keys;

        if (keys[KEY_MOVE_LEFT] || keys[KEY_MOVE_RIGHT]) {
            
        }
    }

}