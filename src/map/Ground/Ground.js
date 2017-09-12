import MapTiles from '../MapTiles';

import { MAX_MOVE_SPEED, GROUND_WIDTH, GROUND_HEIGHT, GROUND_EDGE_WIDTH, SLOPE_GROUND_DELTA } from '../../config';

const { Rectangle, Sprite, Container } = PIXI;
const { TilingSprite } = PIXI.extras;
const { TextureCache } = PIXI.utils;

export default class Ground extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            edgeTexture = null,
            edge = 'none',
            size = 1,
            showTexture = true,
            
            groundWidth = GROUND_WIDTH,
            edgeWidth = GROUND_EDGE_WIDTH,
            deltaOfGroundAndSlope = SLOPE_GROUND_DELTA - GROUND_HEIGHT,

            ...rest
        } = opt;

        super({
            ...rest,
            width: size * groundWidth + ((edge == 'left' || edge == 'right') && edgeWidth / 2 || edge == 'both' && edgeWidth || 0),
            tilesType: 'bottom',
            lineFunction: x => 0
        });

        texture && showTexture && this._setGroundTexture(size * groundWidth, deltaOfGroundAndSlope, texture, edge, edgeWidth, edgeTexture);
    }

    _setGroundTexture (width, deltaOfGroundAndSlope, groundTexture, edge, edgeWidth, edgeTexture) {
        groundTexture = TextureCache[groundTexture];
        edgeTexture = edgeTexture && TextureCache[edgeTexture].clone();

        let container = new Container();
        let tiling = new TilingSprite(groundTexture, width, groundTexture.height);

        container.addChild(tiling) ;
        container.y = deltaOfGroundAndSlope;

        if (edge == 'left' && edgeTexture) {

            tiling.x = edgeWidth / 2;
            edgeTexture.frame = new Rectangle(0, 0, edgeWidth / 2, edgeTexture.height);

            container.addChild(new Sprite(edgeTexture));
        } else if (edge == 'right' && edgeTexture) {

            edgeTexture.frame = new Rectangle(edgeWidth / 2, 0, edgeWidth / 2, edgeTexture.height);

            let edge = new Sprite(edgeTexture);
            edge.x = width;

            container.addChild(edge);
        } else if (edge == 'both' && edgeTexture) {
            let leftTexture = edgeTexture.clone();
            let rightTexture = edgeTexture.clone();
        
            leftTexture.frame = new Rectangle(0, 0, edgeWidth / 2, edgeTexture.height);
            rightTexture.frame = new Rectangle(edgeWidth / 2, 0, edgeWidth / 2, edgeTexture.height); 

            tiling.x = edgeWidth / 2;

            let leftEdge = new Sprite(leftTexture);
            let rightEdge = new Sprite(rightTexture);

            rightEdge.x = edgeWidth / 2 + width;
            
            container.addChild(leftEdge);
            container.addChild(rightEdge);
        }
    
        this.addChildAt(container, 0)
    }

}
