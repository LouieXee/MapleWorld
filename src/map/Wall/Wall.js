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
            dir = 'left',

            wallHeight = WALL_HEIGHT,
            groundHeight = GROUND_HEIGHT,

            ...rest
        } = opt;

        super({
            ...rest,
            height: height || size * wallHeight,
            tilesType: dir,
            lineFunction: y => 0,
            texture: texture && (() => {
                let textureWall = TextureCache[texture];
                let mapTexture = new MapTexture('wall', {
                        wall: textureWall
                    }, {
                        size,
                        dir,
                        groundHeight
                    }).getTexture();
                let sprite = new Sprite(mapTexture);

                dir == 'left' && (sprite.x = - textureWall.width);

                return sprite;
            })()
        });

    }

}
