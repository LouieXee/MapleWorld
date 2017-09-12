import MapTiles from '../MapTiles';

import { WALL_HEIGHT, GROUND_HEIGHT } from '../../config';

const { TilingSprite } = PIXI.extras;
const { TextureCache } = PIXI.utils;

export default class Wall extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            size = 1,
            height,
            showTexture = true,
            type = 'left',

            wallHeight = WALL_HEIGHT,
            groundHeight = GROUND_HEIGHT,

            ...rest
        } = opt;

        super({
            ...rest,
            height: height || size * wallHeight,
            tilesType: type,
            lineFunction: y => 0
        });

        texture && showTexture && this._setWallTexture(type, texture, size * wallHeight, groundHeight);
    }

    _setWallTexture (type, texture, height, groundHeight) {
        texture = TextureCache[texture];

        let sprite = new TilingSprite(texture, texture.width, height);

        type == 'left' && (sprite.x = -texture.width);

        sprite.y = groundHeight

        this.addChildAt(sprite, 0);
    }

}
