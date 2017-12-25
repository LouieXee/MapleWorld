const { CanvasRenderer, WebGLRenderer, Rectangle, Sprite, Container, Texture } = PIXI;
const { ParticleContainer } = PIXI.particles;
const { TilingSprite } = PIXI.extras;

export default class MapTexture extends Sprite {

    constructor (type, textures, opt = {}) {
        super();

        this._type = type;
        this._textures = textures;
        this._opt = opt;
        this._canvasCache = null;

        this._handleTextureCache();
    }

    // toCanvas () {
    //     if (this._canvasCache) {
    //         return this._canvasCache;
    //     }

    //     this._canvasCache = document.createElement('canvas');
    //     this.renderCanvas(new CanvasRenderer({
    //         width: this.children[0].width,
    //         height: this.children[0].height,
    //         view: this._canvasCache,
    //         transparent: true
    //     }));

    //     return this._canvasCache;
    // }

    _handleTextureCache () {
        switch(this._type) {
            case 'ground':
                return this._handleGroundTexture();
            case 'slope':
                return this._handleSlopeTexture();
            case 'wall':
                return this._handleWallTexture();
        }
    }

    _handleWallTexture () {
        let texture = this._textures.wall;
        let {
            size = 1,
            dir,
            groundHeight
        } = this._opt;

        let tiling = new TilingSprite(texture, texture.width, size * texture.height);

        this.addChild(tiling);

        this.y = groundHeight;
        if (dir == 'left') {
            this.x = - texture.width;
        }
    }

    _handleSlopeTexture () {
        let texture = this._textures.slope;
        let {
            size = 1,
            dir = 'left',
            groundHeight
        } = this._opt;
        let container = new Container();
        let getPositionByIndex = dir == 'left' ? i => {
                return [i * texture.width, (size - 1 - i) * (texture.height - groundHeight)];
            } : i => {
                return [i * texture.width, i * (texture.height - groundHeight)];
            }

        for (let i = 0; i < size; i++) {
            let slope = new Sprite(texture);
            let [x, y] = getPositionByIndex(i);

            slope.x = x;
            slope.y = y;

            container.addChild(slope);
        }

        this.addChild(container);
    }

    _handleGroundTexture () {
        let textureGround = this._textures.ground;
        let textureEdge = this._textures.edge;
        let {
            size = 1,
            edge = 'none',
            groundHeight,
        } = this._opt;
        let container = new Container();
        let tiling = new TilingSprite(textureGround, size * textureGround.width, textureGround.height);

        container.addChild(tiling);

        if (edge == 'left') {
            textureEdge = textureEdge.clone();

            tiling.x = textureEdge.width / 2;
            textureEdge.frame = new Rectangle(0, 0, textureEdge.width / 2, textureEdge.height);

            container.addChild(new Sprite(textureEdge));
        } else if (edge == 'right') {
            textureEdge = textureEdge.clone();

            textureEdge.frame = new Rectangle(textureEdge.width / 2, 0, textureEdge.width / 2, textureEdge.height);

            let edge = new Sprite(textureEdge);
            edge.x = size * textureGround.width;

            container.addChild(edge);
        } else if (edge == 'both') {
            let leftTexture = textureEdge.clone();
            let rightTexture = textureEdge.clone();
        
            leftTexture.frame = new Rectangle(0, 0, textureEdge.width / 2, textureEdge.height);
            rightTexture.frame = new Rectangle(textureEdge.width / 2, 0, textureEdge.width / 2, textureEdge.height); 

            tiling.x = textureEdge.width / 2;

            let leftEdge = new Sprite(leftTexture);
            let rightEdge = new Sprite(rightTexture);

            rightEdge.x = textureEdge.width / 2 + size * textureGround.width;
            
            container.addChild(leftEdge);
            container.addChild(rightEdge);
        }

        this.addChild(container);
        this.y = groundHeight - textureGround.height;
    }

}
