import Character from '../Character';

import { Vector } from '../../utils';
import { 
    STATUS_STAND, STATUS_MOVE, STATUS_AIR, STATUS_HIT, STATUS_DEAD
} from '../../config';

const { createAnimatedSprite } = Character;

export default class Snail extends Character {

    constructor (displayObj) {
        super(displayObj, {
            width: 45,
            height: 35,
            maxMoveSpeed: 1,
            animations: {
                [STATUS_STAND]: createAnimatedSprite('snail-stand'),
                [STATUS_HIT]: createAnimatedSprite('snail-hit'),
                [STATUS_AIR]: createAnimatedSprite('snail-jump'),
                [STATUS_MOVE]: createAnimatedSprite('snail-move', 4, { animationSpeed: 0.13 }),
                [STATUS_DEAD]: createAnimatedSprite('snail-die', 3, { animationSpeed: 0.09 })
            }
        });
    }

}
