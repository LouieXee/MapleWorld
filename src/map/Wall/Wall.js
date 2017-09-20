import MapTiles from '../MapTiles';
import MapTexture from '../MapTexture';

import { WALL_HEIGHT, GROUND_HEIGHT } from '../../config';

const { Sprite } = PIXI;
const { TextureCache } = PIXI.utils;

export default class Wall extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            size = 1,
            height,
            type = 'left',

            wallHeight = WALL_HEIGHT,
            groundHeight = GROUND_HEIGHT,

            ...rest
        } = opt;

        super({
            ...rest,
            height: height || size * wallHeight,
            tilesType: type,
            lineFunction: y => 0,
            texture: texture && (() => {
                let textureWall = TextureCache[texture];
                let mapTexture = new MapTexture('wall', {
                        wall: textureWall
                    }, {
                        size,
                        type,
                        groundHeight
                    }).getTexture();
                let sprite = new Sprite(mapTexture);

                type == 'left' && (sprite.x = - textureWall.width);

                return sprite;
            })()
        });

    }

}
