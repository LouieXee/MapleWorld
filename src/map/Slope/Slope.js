import { GRAVITY } from '../../config';

const { Sprite, Graphics, particles } = PIXI;
const { ParticleContainer } = particles;

export default class Slope extends Sprite {

    constructor (opt) {
        super();

        const {
            texture,
            x = 0,
            y = 0,
            size = 1,
            type = 'left',
            debug = false,
            showTexture = true,

            deltaHeight = 26,
            leftFunction = x => { return -2 / 3 * x},
            rightFunction = x => { return 2 / 3 * x }
        } = opt;

        this.x = x;
        this.y = y;
        this._width = size * texture.width;
        this._height = size * (texture.height - deltaHeight);
        this._type = type;
        this._slopeTexture = texture;
        this._lineFunction = type == 'left' 
                        ? x => { return leftFunction(x) + this._height; } 
                        : rightFunction;

        this._debug = debug;
        this._showTexture = showTexture;

        debug && this._setDebugMode();
        showTexture && this._addSlopeChild(
            size, 
            this._type == 'left'
            ? i => {
                return [i * texture.width, (size - 1 - i) * (texture.height - deltaHeight)];
            } 
            : i => {
                return [i * texture.width, i * (texture.height - deltaHeight)];
            }
        );
    }

    _setDebugMode () {
        let line = new Graphics();

        line.lineStyle(1, 0xFF0000, 1);
        line.moveTo(0, this._lineFunction(0));
        line.lineTo(this._width, this._lineFunction(this._width));

        this.addChild(line);
    }

    _addSlopeChild (size, getPositionByIndex) {
        let texture = this._slopeTexture;
        let container = new ParticleContainer();

        for (let i = 0; i < size; i++) {
            let slope = new Sprite(texture);
            let [x, y] = getPositionByIndex(i);

            slope.x = x;
            slope.y = y;

            container.addChild(slope);
        }

        this.addChild(container);
    }

    check (obj) {
        if (obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocityY() >= 0) {
            let localLastPoint = this.toLocal(obj.getLastPoint());
            let localCurrentPoint = this.toLocal(obj.position);
            let currentLineY = this._lineFunction(localCurrentPoint.x);
            let maxMoveSpeed = obj.getMaxMoveSpeed();

            if (localLastPoint.y <= this._lineFunction(localLastPoint.x) + maxMoveSpeed && localCurrentPoint.y >= currentLineY - maxMoveSpeed) {
                obj
                .addForce(0, -GRAVITY, 'ground')
                .setVelocityY(0);

                localCurrentPoint.y = currentLineY;

                obj.y = this.toGlobal(localCurrentPoint).y;

                return true;
            }
        }

        obj.removeForce('ground');

        return false;
    }

}
