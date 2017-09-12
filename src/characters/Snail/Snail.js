import Character from '../Character';

import { Vector } from '../../utils';

export default class Snail extends Character {

    constructor () {
        super({
            width: 50,
            height: 50,
            maxMoveSpeed: 1
        });
    }

}
