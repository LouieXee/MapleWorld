import { Vector, Events } from '../../utils';
import { 
    KEY_MOVE_LEFT, KEY_MOVE_UP, KEY_MOVE_RIGHT, KEY_MOVE_DOWN, 
    KEY_JUMP, KEY_ATTACK, KEY_SKILL1, KEY_SKILL2,
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

        this._events = new Events();

        this._events.on('attack', (type, obj) => {
            if (type == 'attack') {
                obj.setStatus(STATUS_ATTACK);

                setTimeout(() => {
                    obj.setStatus(STATUS_STAND);
                }, 1000)
            }
        })
    }

    handleStatus (obj) {
        let keys = obj.getKeys();
        let composedForce = obj.getComposedForce();

        if (obj.getStatus() == STATUS_DEAD) {
            return false;
        }

        // 可操作状态
        if (composedForce.y == 0 && obj.getStatus() != STATUS_HIT && obj.getStatus() != STATUS_ATTACK) {
            // 移动
            if (keys[KEY_MOVE_LEFT] || keys[KEY_MOVE_RIGHT]) {
                keys[KEY_MOVE_LEFT] && obj.addForce('moveLeft', this.moveForce.clone().invertX());
                keys[KEY_MOVE_RIGHT] && obj.addForce('moveRight', this.moveForce.clone());
            }

            // 停止移动
            if (!keys[KEY_MOVE_LEFT] || !keys[KEY_MOVE_RIGHT]) {
                !keys[KEY_MOVE_LEFT] && obj.removeForce('moveLeft');
                !keys[KEY_MOVE_RIGHT] && obj.removeForce('moveRight');
            }

            // 跳跃
            if (keys[KEY_JUMP]) {
                obj.addVelocity(this.jumpVelocity);
            }
        }

        // 可攻击状态 
        if ((keys[KEY_ATTACK] || keys[KEY_SKILL1] || keys[KEY_SKILL2]) && obj.getStatus() != STATUS_HIT && obj.getStatus() != STATUS_ATTACK) {
            obj.removeForce('moveLeft');
            obj.removeForce('moveRight');

            this._events.emit('attack',
                keys[KEY_ATTACK] && 'attack'
                || keys[KEY_SKILL1] && 'skill1'
                || keys[KEY_SKILL2] && 'skill2',
                obj
            )
        }

        // 调整朝向
        if (!(keys[KEY_MOVE_LEFT] && keys[KEY_MOVE_RIGHT])) {
            keys[KEY_MOVE_LEFT] && obj.setDir('left');
            keys[KEY_MOVE_RIGHT] && obj.setDir('right');
        }

        if (obj.getStatus() != STATUS_ATTACK && obj.getStatus() != STATUS_HIT) {
            if (composedForce.y != 0) {
                obj.setStatus(STATUS_AIR);

                obj.removeForcesByTag('horizontal')
            } else if (obj.getVelocity().x != 0) {
                obj.setStatus(STATUS_MOVE);
            } else {
                obj.setStatus(STATUS_STAND);
            }

        }        

        return true;
    }

}