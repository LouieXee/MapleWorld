import MapTiles from '../MapTiles';
import MapTexture from '../MapTexture';

import { GROUND_WIDTH, GROUND_HEIGHT, GROUND_EDGE_WIDTH } from '../../config';

const { Sprite } = PIXI;
const { TextureCache } = PIXI.utils;

export default class Ground extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            edgeTexture = null,
            edge = 'none',
            size = 1,
            
            groundWidth = GROUND_WIDTH,
            groundHeight = GROUND_HEIGHT,
            edgeWidth = GROUND_EDGE_WIDTH,

            ...rest
        } = opt;

        super({
            ...rest,
            width: size * groundWidth + ((edge == 'left' || edge == 'right') && edgeWidth / 2 || edge == 'both' && edgeWidth || 0),
            tilesType: 'bottom',
            lineFunction: x => 0,
            texture: texture && new MapTexture('ground', {
                ground: TextureCache[texture],
                edge: TextureCache[edgeTexture]
            }, {
                size,
                edge,
                groundHeight
            })
        });
    }

}
