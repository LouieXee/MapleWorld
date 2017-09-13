import Character from '../Character';

import { Vector } from '../../utils';
import { 
    KEY_JUMP,
    STATUS_STAND, STATUS_MOVE, STATUS_AIR, STATUS_ATTACK, STATUS_HIT, STATUS_DEAD
} from '../../config';

const { createAnimatedSprite } = Character;

export default class Ninja extends Character {

    constructor (displayObj) {
        super(displayObj, {
            width: 75,
            height: 70,
            maxMoveSpeed: 5,
            animations: {
                [STATUS_HIT]: createAnimatedSprite('ninja-hit'),
                [STATUS_AIR]: createAnimatedSprite('ninja-move'),
                [STATUS_STAND]: createAnimatedSprite('ninja-stand', 5, { animationSpeed: 0.16 }),
                [STATUS_MOVE]: createAnimatedSprite('ninja-move', 3, { animationSpeed: 0.16 }),
                [STATUS_ATTACK]: createAnimatedSprite('ninja-attack', 6, { 
                    animationSpeed: 0.25, 
                    onFrameChange: (frameIndex) => { 
                        if (frameIndex == 5) {
                            displayObj.setStatus(STATUS_STAND);
                        }
                    }
                }),
                [STATUS_DEAD]: createAnimatedSprite('ninja-die', 10, { animationSpeed: 0.13 })
            }
        });

        this._isCanAirJump = false;
        this._jumpCount = 0;
        this._airJumpVelocity = new Vector(10, -20);

        this._events
        .on('attack', type => {
            type == 'attack' && displayObj.setStatus(STATUS_ATTACK)
        })
        .on('hit', () => {
            this._isCanAirJump = false;
        })
    }

    // @override
    handleKeys () {
        let obj = this._displayObj;
        let keys = obj.getKeys();
        let composedForce = obj.getComposedForce();

        super.handleKeys();

        if (composedForce.y == 0) {
            this._jumpCount = 0;
            this._isCanAirJump = false;
        }

        if (!keys[KEY_JUMP] && composedForce.y != 0 && this._jumpCount == 0 && obj.getStatus() != STATUS_HIT && obj.getStatus() != STATUS_ATTACK) {
            this._isCanAirJump = true;
        }

        if (keys[KEY_JUMP] && composedForce.y != 0 && this._isCanAirJump) {
            let vel = obj.getDir() == 'right' ? this._airJumpVelocity.clone() : this._airJumpVelocity.clone().invertX();

            this._jumpCount++;
            this._isCanAirJump = false;
            obj.addVelocity(vel)
        }
    }

}
