const { CanvasRenderer, Rectangle, Sprite, Container, Texture } = PIXI;
const { ParticleContainer } = PIXI.particles;
const { TilingSprite } = PIXI.extras;

export default class MapTexture {

    constructor (type, textures, opt = {}) {
        this._type = type;
        this._textures = textures;
        this._opt = opt;
        this._textureCache = document.createElement('canvas');

        this._stage = new Container();
        this._renderer = new CanvasRenderer({
            width: 0,
            height: 0,
            view: this._textureCache,
            transparent: true
        });
        this._renderer.autoResize = true;

        this._handleTextureCache();
    }

    getTexture () {
        return Texture.from(this._textureCache);
    }

    getCanvas () {
        return this._textureCache;
    }

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
        let stage = this._stage;
        let renderer = this._renderer;
        let texture = this._textures.wall;
        let {
            size = 1,
            groundHeight
        } = this._opt;

        renderer.resize(
            texture.width,
            size * texture.height + groundHeight
        );
        stage.removeChildren();

        let tiling = new TilingSprite(texture, texture.width, size * texture.height);

        tiling.y = groundHeight;

        stage.addChild(tiling);
        renderer.render(stage);
    }

    _handleSlopeTexture () {
        let stage = this._stage;
        let renderer = this._renderer;
        let texture = this._textures.slope;
        let {
            size = 1,
            dir = 'left',
            slopeGroundHeight
        } = this._opt;
        let container = new ParticleContainer();
        let getPositionByIndex = dir == 'left' ? i => {
                return [i * texture.width, (size - 1 - i) * (texture.height - slopeGroundHeight)];
            } : i => {
                return [i * texture.width, i * (texture.height - slopeGroundHeight)];
            }

        renderer.resize(
            size * texture.width,
            size * ( texture.height - slopeGroundHeight ) + slopeGroundHeight
        );
        stage.removeChildren();

        for (let i = 0; i < size; i++) {
            let slope = new Sprite(texture);
            let [x, y] = getPositionByIndex(i);

            slope.x = x;
            slope.y = y;

            container.addChild(slope);
        }

        stage.addChild(container);
        renderer.render(stage);
    }

    _handleGroundTexture () {
        let stage = this._stage;
        let renderer = this._renderer;
        let textureGround = this._textures.ground;
        let textureEdge = this._textures.edge;
        let {
            size = 1,
            edge = 'none',
            deltaOfGroundAndSlope,
        } = this._opt;
        let container = new Container();
        let tiling = new TilingSprite(textureGround, size * textureGround.width, textureGround.height);

        renderer.resize(
            size * textureGround.width + ((edge == 'left' || edge == 'right') && textureEdge.width / 2 || edge == 'both' && textureEdge.width || 0),
            textureGround.height
        );

        stage.removeChildren();

        container.addChild(tiling);
        container.y = deltaOfGroundAndSlope;

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

        stage.addChild(container);
        renderer.render(stage);
    }

}
