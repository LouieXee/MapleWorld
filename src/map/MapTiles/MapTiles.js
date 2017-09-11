const { Sprite, Graphics, particles } = PIXI;
const { ParticleContainer } = particles;

const DELTA = .1;

export default class MapTiles extends Sprite {

    constructor (opt) {
        super();

        const {
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            tilesType = 'bottom',
            friction = .8,
            debug = false,
            lineFunction = x => 0
        } = opt;

        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
        this._tilesType = tilesType;
        this._friction = friction;
        this._lineFunction = lineFunction;

        this._forcesKey = (tilesType == 'bottom' || tilesType == 'top') && 'vertical'
                        || (tilesType == 'left' || tilesType == 'right') && 'horizontal'

        this._debug = debug;

        debug && this._setDebugMode();
    }

    _setDebugMode () {
        const COLOR = 0xFF0000;

        let line = new Graphics();

        line.lineStyle(1, COLOR, 1);
        line.moveTo(0, this._lineFunction(0));

        if (this._tilesType == 'top' || this._tilesType == 'bottom') {
            line.lineTo(this._width, this._lineFunction(this._width));
        } else if (this._tilesType == 'left' || this._tilesType == 'right') {
            line.lineTo(this._lineFunction(this._height), this._height);
        }

        this.addChild(line);
    }

    check (obj) {
        let _this = this;
        let forcesKey = this._forcesKey;

        if (this._tilesType == 'bottom' && obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y >= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue, delta } = _getBasicData(forcesKey);

            if (localLastPoint.y <= lastTargetValue + delta && localCurrentPoint.y >= currentTargetValue - delta) {
                let composedForce = obj.getComposedForce();

                _handleObj(forcesKey, composedForce, localCurrentPoint, currentTargetValue);

                if (obj.hasForce('friction') && (obj.getVelocity().x == 0 || obj.getVelocity().x * obj.getLastVelocity().x < 0)) {
                    // 摩擦力作用使速度降到0，同时移除摩擦力
                    obj.removeForce('friction');
                    obj.setVelocityX(0);
                } else if (!obj.hasForce('friction') && obj.getVelocity().x != 0) {
                    // 当物体受力则添加摩擦力
                    let frictionX = composedForce.x == 0 ? obj.getWeight() * this._friction
                                    : Math.min(Math.abs(composedForce.x), obj.getWeight() * this._friction);

                    obj.addForce(
                        'friction', 
                        (obj.getVelocity().x > 0 ? -1 : 1)  * frictionX, 
                        0, 
                        'horizontal'
                    )
                }

                return true;
            }
        } else if (this._tilesType == 'top' && obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y <= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue, delta } = _getBasicData(forcesKey);
            let objHeight = obj.getHeight();

            if (localLastPoint.y - objHeight >= lastTargetValue - delta && localCurrentPoint.y - objHeight <= currentTargetValue + delta) {
                _handleObj(forcesKey, obj.getComposedForce(), localCurrentPoint, currentTargetValue + objHeight);

                return true;
            }
        } else if (this._tilesType == 'left' && obj.y >= this.y && obj.y <= this.y + this._height && obj.getVelocity().x >= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue, delta } = _getBasicData(forcesKey);

            if (localLastPoint.x <= lastTargetValue + delta && localCurrentPoint.x >= currentTargetValue - delta) {
                _handleObj(forcesKey, obj.getComposedForce(), localCurrentPoint, currentTargetValue);

                return true;
            }
        } else if (this._tilesType == 'right' && obj.y >= this.y && obj.y <= this.y + this._height && obj.getVelocity().x <= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue, delta } = _getBasicData(forcesKey);

            if (localLastPoint.x >= lastTargetValue - delta && localCurrentPoint.x <= currentTargetValue + delta) {
                _handleObj(forcesKey, obj.getComposedForce(), localCurrentPoint, currentTargetValue);

                return true;
            }
        }

        obj
        .removeForce(forcesKey)

        return false;

        function _getBasicData (type) {
            let localLastPoint = _this.toLocal(obj.getLastPoint(), _this.parent);
            let localCurrentPoint = _this.toLocal(obj.position, _this.parent);
            let lastTargetValue = _this._lineFunction(type == 'vertical' ? localLastPoint.x : localLastPoint.y);
            let currentTargetValue = _this._lineFunction(type == 'vertical' ? localCurrentPoint.x : localCurrentPoint.y);
            /*
                1. 因为toLocal和toGlobal的转化会有小数点后数位的差异
                2. 上坡处理
                3. 下坡处理

                所以在最后比较时会有一个上下浮动
            */
            let delta = obj.getVelocity().length() + DELTA;

            return {
                localLastPoint,
                localCurrentPoint,
                lastTargetValue,
                currentTargetValue,
                delta
            };
        }

        function _handleObj (type, composedForce, localCurrentPoint, targetValue) {
            if (type == 'vertical') {
                obj
                .addForce(type, 0, -composedForce.y, 'vertical')
                .setVelocityY(0);

                localCurrentPoint.y = targetValue;
                obj.y = _this.parent.toLocal(localCurrentPoint, _this).y;
            } else if (type == 'horizontal') {
                obj
                .addForce(type, -composedForce.x, 0, 'horizontal')
                .setVelocityX(0);

                localCurrentPoint.x = targetValue;
                obj.x = _this.parent.toLocal(localCurrentPoint, _this).x;
            }
        }
    }

}
