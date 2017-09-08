import { Vector } from '../../utils';
import { 
    DROP_SPEED_TO_BE_AIR,
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
            maxMoveSpeed = 3,
            jumpVelocity = new Vector(0, -8),
            moveForce = new Vector(1, 0)
        } = opt;

        this.width = width;
        this.height = height;
        this.weight = weight;
        this.animation = animation;
        this.jumpVelocity = jumpVelocity;
        this.moveForce = moveForce;
        this.maxMoveSpeed = maxMoveSpeed;
    }

    handleStatus (keys, currentStatus, currentForces, currentVelocity) {
        let status = currentStatus;
        let forces = { ...currentForces };
        let velocity = currentVelocity.clone();
        let resultForce = new Vector(0, 0);

        // 计算合力
        for (let key in forces) {
            resultForce.add(forces[key]);
        }

        // 移动
        if ((keys[KEY_MOVE_LEFT] || keys[KEY_MOVE_RIGHT]) && status != STATUS_AIR) {
            keys[KEY_MOVE_LEFT] && (forces['moveLeft'] = this.moveForce.clone().invertX());
            keys[KEY_MOVE_RIGHT] && (forces['moveRight'] = this.moveForce.clone());
        }

        // 停止移动
        if ((!keys[KEY_MOVE_LEFT] || !keys[KEY_MOVE_RIGHT]) && status != STATUS_AIR) {
            !keys[KEY_MOVE_LEFT] && (delete forces['moveLeft']);
            !keys[KEY_MOVE_RIGHT] && (delete forces['moveRight']);

            if (!forces['moveLeft'] && !forces['moveRight']) {
                velocity.x = 0;
            }
        }

        // 跳跃
        if (keys[KEY_JUMP] && (status == STATUS_STAND || status == STATUS_MOVE)) {
            velocity.add(this.jumpVelocity);
        }

        if (resultForce.y != 0) {
            status = STATUS_AIR;

            delete forces['moveLeft'];
            delete forces['moveRight'];
        } else if (resultForce.x != 0) {
            status = STATUS_MOVE;
        } else {
            status = STATUS_STAND;
        }

        return {
            status,
            forces,
            velocity
        };
    }

}