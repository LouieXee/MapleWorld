import MapTiles from '../MapTiles';

import { MAX_MOVE_SPEED, GROUND_WIDTH, GROUND_HEIGHT, GROUND_EDGE_WIDTH, SLOPE_GROUND_DELTA } from '../../config';

const { TilingSprite } = PIXI.extras;

export default class Ground extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            edge = 'none',
            size = 1,
            showTexture = true,
            
            groundWidth = GROUND_WIDTH,
            deltaOfGroundAndSlope = GROUND_HEIGHT - SLOPE_GROUND_DELTA,

            ...rest
        } = opt;

        super({
            ...rest,
            width: size * groundWidth,
            tilesType: 'bottom',
            lineFunction: x => deltaOfGroundAndSlope
        });

        texture && showTexture && this.addChild(new TilingSprite(texture, size * texture.width, texture.height));

        this._debug && this._setDebugMode();
    }

}
