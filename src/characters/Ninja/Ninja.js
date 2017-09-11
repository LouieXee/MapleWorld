import Character from '../Character';

import { Vector } from '../../utils';
import { KEY_JUMP } from '../../config';

export default class Ninja extends Character {

    constructor () {
        super();

        this._isCanAirJump = false;
        this._jumpCount = 0;
        this._airJumpVelocity = new Vector(10, -20);
    }

    // @override
    handleStatus (obj) {
        let keys = obj.getKeys();
        let composedForce = obj.getComposedForce();

        if (!super.handleStatus(obj)) {
            return false;
        }

        if (!keys[KEY_JUMP] && composedForce.y != 0 && this._jumpCount == 0) {
            this._isCanAirJump = true;
        }

        if (keys[KEY_JUMP] && composedForce.y != 0 && this._isCanAirJump) {
            let vel = obj.getDir() == 'right' ? this._airJumpVelocity.clone() : this._airJumpVelocity.clone().invertX();

            this._jumpCount++;
            this._isCanAirJump = false;
            obj.addVelocity(vel)
        }

        if (composedForce.y == 0) {
            this._jumpCount = 0;
            this._isCanAirJump = false;
        }
    }

}
