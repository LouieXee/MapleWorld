import { SLOPE_GROUND_DELTA, SLOPE_WIDTH, SLOPE_HEIGHT, SLOPE_LEFT_VALUE, SLOPE_RIGHT_VALUE } from '../../config';

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

            slopeWidth = SLOPE_WIDTH,
            slopeHeight = SLOPE_HEIGHT,
            deltaHeight = SLOPE_GROUND_DELTA,
            leftFunction = x => { return SLOPE_LEFT_VALUE * x},
            rightFunction = x => { return SLOPE_RIGHT_VALUE * x }
        } = opt;

        this.x = x;
        this.y = y;
        this._width = size * slopeWidth;
        this._height = size * (slopeHeight - deltaHeight);
        this._type = type;
        this._slopeTexture = texture;
        this._lineFunction = type == 'left' 
                        ? x => { return leftFunction(x) + this._height; } 
                        : rightFunction;

        this._debug = debug;
        this._showTexture = showTexture;

        texture && showTexture && this._addSlopeChild(
            size, 
            this._type == 'left'
            ? i => {
                return [i * slopeWidth, (size - 1 - i) * (slopeHeight - deltaHeight)];
            } 
            : i => {
                return [i * slopeWidth, i * (slopeHeight - deltaHeight)];
            }
        );

        debug && this._setDebugMode();
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
        if (obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y >= 0) {
            let localLastPoint = this.toLocal(obj.getLastPoint());
            let localCurrentPoint = this.toLocal(obj.position);
            let currentLineY = this._lineFunction(localCurrentPoint.x);
            let maxMoveSpeed = obj.getMaxMoveSpeed();

            if (localLastPoint.y <= this._lineFunction(localLastPoint.x) + maxMoveSpeed && localCurrentPoint.y >= currentLineY - maxMoveSpeed) {
                let force = obj.getResultForce();

                obj
                .addForce('ground', 0, -force.y)
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
