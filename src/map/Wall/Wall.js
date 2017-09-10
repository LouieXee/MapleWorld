import MapTiles from '../MapTiles';

import { WALL_HEIGHT } from '../../config';

const { TilingSprite } = PIXI.extras;

export default class Wall extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            size = 1,
            showTexture = true,
            type = 'left',

            wallHeight = WALL_HEIGHT,

            ...rest
        } = opt;

        super({
            ...rest,
            height: size * wallHeight,
            tilesType: type,
            lineFunction: y => 0
        });

        texture && showTexture && this._setWallTexture(type, size, texture)

        this._debug && this._setDebugMode();

    }

    _setWallTexture (type, size, texture) {
        let sprite = new TilingSprite(texture, texture.width, size * texture.height);

        type == 'left' && (sprite.x = -texture.width);

        this.addChild(sprite);
    }

}
