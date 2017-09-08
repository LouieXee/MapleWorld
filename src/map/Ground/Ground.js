import { MAX_MOVE_SPEED, GROUND_WIDTH, GROUND_HEIGHT, GROUND_EDGE_WIDTH, SLOPE_GROUND_DELTA } from '../../config';

const { Sprite, utils, Graphics } = PIXI;
const { TilingSprite } = PIXI.extras;

export default class Ground extends Sprite {

    constructor (opt) {
        super();

        const {
            texture = null,
            x = 0,
            y = 0,
            size = 1,
            edge = 'none',
            debug = false,
            showTexture = true,

            // 地面和斜坡有1的差值
            delta = GROUND_HEIGHT - SLOPE_GROUND_DELTA
        } = opt;

        this.x = x;
        this.y = y;
        this._width = size * GROUND_WIDTH;
        this._groundTexture = texture;
        this._delta = delta;

        this._debug = debug;
        this._showTexture = showTexture;

        texture && showTexture && this.addChild(new TilingSprite(texture, this._width, texture.height));

        debug && this._setDebugMode();
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
            && obj.getVelocity().y >= 0
            && (( obj.getLastPoint().y <= this.y && obj.y >= this.y ) 
                // 上坡过程中进入平地做特殊判断
                || ( obj.getLastPoint().y == obj.y && Math.abs(obj.y - this.y) <= obj.getMaxMoveSpeed() + this._delta ))
        ) {
            let force = obj.getResultForce();

            obj
            .addForce('ground', 0, -force.y)
            .setVelocityY(0);

            obj.y = this.y;

            return true;
        }

        obj.removeForce('ground');

        return false;
    }

}
