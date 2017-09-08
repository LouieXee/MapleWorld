import { GRAVITY, MAX_MOVE_SPEED } from '../../config';

const { Sprite, utils, Graphics } = PIXI;
const { TilingSprite } = PIXI.extras;

// 地面和斜坡有1px的差值
const DELTA = 1;

export default class Ground extends Sprite {

    constructor (opt) {
        super();

        const {
            texture,
            x = 0,
            y = 0,
            size = 1,
            debug = false,
            showTexture = true
        } = opt;

        this.x = x;
        this.y = y;
        this._width = size * texture.width;
        this._height = texture.height;
        this._size = size;
        this._groundTexture = texture;

        this._debug = debug;
        this._showTexture = showTexture;

        debug && this._setDebugMode();
        showTexture && this.addChild(new TilingSprite(texture, this._width, this._height));
    }

    _setDebugMode () {
        let line = new Graphics();

        line.lineStyle(1, 0xFF0000, 1);
        line.moveTo(0, 0);
        line.lineTo(this._width, 0);

        this.addChild(line)
    }

    check (obj) {
        if (obj.x >= this.x && obj.x <= this.x + this._width
            && obj.getVelocityY() >= 0
            && (( obj.getLastY() <= this.y && obj.y >= this.y ) 
                // 上坡过程中进入平地做特殊判断
                || ( obj.getLastY() == obj.y && Math.abs(obj.y - this.y) <= obj.getMaxMoveSpeed() + DELTA ))
        ) {
            obj
            .addForce(0, -GRAVITY, 'ground')
            .setVelocityY(0);

            obj.y = this.y;

            return true;
        }

        obj.removeForce('ground');

        return false;
    }

}
