import { GRAVITY, MAX_MOVE_SPEED } from '../../config';

const { Sprite, utils } = PIXI;
const { TilingSprite } = PIXI.extras;

export default class Ground extends Sprite {

    constructor (opt) {
        super();

        const {
            x = 0,
            y = 0,
            size = 1,
            texture,
            debug = false
        } = opt;

        this.x = x;
        this.y = y;
        this._width = size * texture.width;
        this._height = texture.height;
        this._size = size;
        this._tilingTexture = texture;

        this._debug = debug;

        this.addChild(new TilingSprite(texture, this._width, this._height));
    }

    check (obj) {
        if (obj.x >= this.x && obj.x <= this.x + this._width
            && obj.getVelocityY() >= 0
            && (( obj.getLastY() <= this.y && obj.y >= this.y ) || ( obj.getLastY() == obj.y && Math.abs(obj.y - this.y) <= MAX_MOVE_SPEED ))
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
