import { Vector, Events } from '../../utils';
import { 
    KEY_MOVE_LEFT, KEY_MOVE_UP, KEY_MOVE_RIGHT, KEY_MOVE_DOWN, 
    KEY_JUMP, KEY_ATTACK, KEY_SKILL1, KEY_SKILL2,
    STATUS_STAND, STATUS_MOVE, STATUS_AIR, STATUS_ATTACK, STATUS_HIT, STATUS_DEAD
} from '../../config';

const { TextureCache } = PIXI.utils;
const { AnimatedSprite } = PIXI.extras;

export default class Character {

    constructor (displayObj, opt = {}) {
        const {
            width = 60,
            height = 100,
            weight = 1,
            animations = {},
            maxMoveSpeed = 3,
            jumpVelocity = new Vector(0, -15),
            moveForce = new Vector(1, 0).setTag('horizontal')
        } = opt;

        this._displayObj = displayObj;

        this.width = width;
        this.height = height;
        this.weight = weight;
        this.animations = animations;
        this.jumpVelocity = jumpVelocity;
        this.moveForce = moveForce;
        this.maxMoveSpeed = maxMoveSpeed;

        this._events = new Events();
    }

    handleHit (vx, vy) {
        let obj = this._displayObj;

        obj
        .setVelocityX(vx)
        .setVelocityY(vy)
        .setStatus(STATUS_HIT);

        this._events.emit('hit');
    }

    handleKeys () {
        let obj = this._displayObj;
        let keys = obj.getKeys();
        let composedForce = obj.getComposedForce();

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
                || keys[KEY_SKILL2] && 'skill2'
            )
        }

        // 调整朝向
        if (!(keys[KEY_MOVE_LEFT] && keys[KEY_MOVE_RIGHT]) && obj.getStatus() != STATUS_HIT && obj.getStatus() != STATUS_ATTACK) {
            keys[KEY_MOVE_LEFT] && obj.setDir('left');
            keys[KEY_MOVE_RIGHT] && obj.setDir('right');
        }
    }

    static createAnimatedSprite (textureName, size = 1, opt = {}) {
        let frames = [];
        let animatedSprite = null;

        for (let i = 1; i <= size; i++) {
            frames.push(TextureCache[`${textureName}${`0${i}`.slice(-2)}.png`]);
        }

        animatedSprite = new AnimatedSprite(frames);

        animatedSprite.x = -animatedSprite.width / 2;
        animatedSprite.y = -animatedSprite.height;

        for (let key in opt) {
            animatedSprite[key] = opt[key];
        }

        return animatedSprite;
    }

}
