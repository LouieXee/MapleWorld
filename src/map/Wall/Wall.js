const { Sprite } = PIXI;

export default class Wall extends Sprite {

    constructor (opt) {
        super();

        const {
            texture = null,
            x = 0,
            y = 0,
            size = 1,
            type = 'left',
            debug = false,
            showTexture = true
        } = opt;

        this.x = x;
        this.y = y;
        this._height

    }



}
