import MapTiles from '../MapTiles';
import MapTexture from '../MapTexture';

import { WALL_HEIGHT, GROUND_HEIGHT, SLOPE_GROUND_HEIGHT } from '../../config';

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
            slopeGroundHeight = SLOPE_GROUND_HEIGHT,

            ...rest
        } = opt;

        super({
            ...rest,
            height: height || size * wallHeight,
            tilesType: dir,
            lineFunction: y => 0,
            texture: texture && new MapTexture('wall', {
                wall: TextureCache[texture]
            }, {
                size,
                dir,
                slopeGroundHeight
            })
        });

    }

}
