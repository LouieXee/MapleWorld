import MapTiles from '../MapTiles';
import MapTexture from '../MapTexture';

import { SLOPE_GROUND_DELTA, SLOPE_WIDTH, SLOPE_HEIGHT, SLOPE_LEFT_VALUE, SLOPE_RIGHT_VALUE } from '../../config';

const { Sprite } = PIXI;
const { TextureCache } = PIXI.utils;

export default class Slope extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            size = 1,
            type = 'left',

            slopeWidth = SLOPE_WIDTH,
            slopeHeight = SLOPE_HEIGHT,
            deltaHeight = SLOPE_GROUND_DELTA,
            leftFunction = x => { return SLOPE_LEFT_VALUE * x },
            rightFunction = x => { return SLOPE_RIGHT_VALUE * x },

            ...rest
        } = opt;

        super({
            ...rest,
            width: size * slopeWidth,
            height: size * (slopeHeight - deltaHeight),
            tilesType: 'bottom',
            lineFunction: type == 'left' 
                        ? x => { return leftFunction(x) + size * (slopeHeight - deltaHeight); } 
                        : rightFunction,
            texture: texture && new Sprite(new MapTexture('slope', {
                    slope: TextureCache[texture]
                }, {
                    size,
                    type,
                    deltaHeight
                }).getTexture())
        });
    }

}
