import MapTiles from '../MapTiles';

import { SLOPE_GROUND_DELTA, SLOPE_WIDTH, SLOPE_HEIGHT, SLOPE_LEFT_VALUE, SLOPE_RIGHT_VALUE } from '../../config';

const { Sprite } = PIXI;
const { ParticleContainer } = PIXI.particles;
const { TextureCache } = PIXI.utils;

export default class Slope extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            size = 1,
            showTexture = true,
            type = 'left',

            slopeWidth = SLOPE_WIDTH,
            slopeHeight = SLOPE_HEIGHT,
            deltaHeight = SLOPE_GROUND_DELTA,
            leftFunction = x => { return SLOPE_LEFT_VALUE * x},
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
                        : rightFunction
        });

        texture && showTexture && this._setSlopTexture(
            size, texture,
            type ? i => {
                return [i * slopeWidth, (size - 1 - i) * (slopeHeight - deltaHeight)];
            } : i => {
                return [i * slopeWidth, i * (slopeHeight - deltaHeight)];
            }
        );
    }

    _setSlopTexture (size, texture, getPositionByIndex) {
        texture = TextureCache[texture];

        let container = new ParticleContainer();

        for (let i = 0; i < size; i++) {
            let slope = new Sprite(texture);
            let [x, y] = getPositionByIndex(i);

            slope.x = x;
            slope.y = y;

            container.addChild(slope);
        }

        this.addChildAt(container, 0);
    }

}
