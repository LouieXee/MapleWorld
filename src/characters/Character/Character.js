import { Vector } from '../../utils';
import { 
    KEY_MOVE_LEFT, KEY_MOVE_UP, KEY_MOVE_RIGHT, KEY_MOVE_DOWN, 
    KEY_JUMP, KEY_ATTACK,
    STATUS_STAND, STATUS_MOVE, STATUS_AIR, STATUS_ATTACK, STATUS_HIT, STATUS_DEAD
} from '../../config';

export default class Character {

    constructor (opt = {}) {
        const {
            width = 60,
            height = 100,
            weight = 1,
            animation = {},
            maxMoveSpeed = 5,
            jumpVelocity = new Vector(0, -15),
            moveForce = new Vector(1, 0).setTag('horizontal')
        } = opt;

        this.width = width;
        this.height = height;
        this.weight = weight;
        this.animation = animation;
        this.jumpVelocity = jumpVelocity;
        this.moveForce = moveForce;
        this.maxMoveSpeed = maxMoveSpeed;
    }

    handleStatus (obj) {
        let keys = obj._keys;
        let composedForce = obj.composeForce();

        // 移动
        if ((keys[KEY_MOVE_LEFT] || keys[KEY_MOVE_RIGHT]) && composedForce.y == 0) {
            keys[KEY_MOVE_LEFT] &&  obj.addForce('moveLeft', this.moveForce.clone().invertX());
            keys[KEY_MOVE_RIGHT] && obj.addForce('moveRight', this.moveForce.clone());
        }

        // 停止移动
        if ((!keys[KEY_MOVE_LEFT] || !keys[KEY_MOVE_RIGHT]) && composedForce.y == 0) {
            !keys[KEY_MOVE_LEFT] && obj.removeForce('moveLeft');
            !keys[KEY_MOVE_RIGHT] && obj.removeForce('moveRight');

            // TODO 添加摩擦力
            if (!obj._forces['moveLeft'] && !obj._forces['moveRight']) {
                obj.setVelocityX(0);
            }
        }

        // 跳跃
        if (keys[KEY_JUMP] && composedForce.y == 0) {
            obj.getVelocity().add(this.jumpVelocity);
        }

        if (composedForce.y != 0) {
            obj._status = STATUS_AIR;

            obj.removeForcesByTag('horizontal')
        } else {
            obj._status = STATUS_STAND;
        } 

        if (obj._status == STATUS_STAND && obj.getVelocity().x != 0) {
            obj._status = STATUS_MOVE;
        }

        console.log(obj._forces)
    }

}