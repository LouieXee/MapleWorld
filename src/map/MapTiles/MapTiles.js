const { Sprite, Graphics, Texture } = PIXI;

const DELTA = .1;

export default class MapTiles extends Sprite {

    constructor (opt) {
        super();

        const {
            texture,
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            tilesType = 'bottom',
            friction = .8,
            debug = false,
            showTexture = true,
            lineFunction = x => 0
        } = opt;

        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
        this._tilesType = tilesType;
        this._friction = friction;
        this._lineFunction = lineFunction;

        this._forcesKey = (tilesType == 'bottom' || tilesType == 'top') && 'vertical-pressure'
                        || (tilesType == 'left' || tilesType == 'right') && 'horizontal-pressure'

        this._debug = debug;

        showTexture && texture && this.addChild(texture);
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

    _handleFriction (obj) {
        if (obj.hasForce('friction') && (obj.getVelocity().x == 0 || obj.getVelocity().x * obj.getLastVelocity().x < 0)) {
            // 摩擦力作用使速度降到0，同时移除摩擦力
            obj.removeForce('friction');
            obj.setVelocityX(0);
        } else if (!obj.hasForce('friction') && (obj.getVelocity().x != 0 || obj.getComposedForce().x != 0)) {
            // 当物体受力则添加摩擦力
            let frictionX = obj.getComposedForce().x == 0 ? obj.getWeight() * this._friction
                            : Math.min(Math.abs(obj.getComposedForce().x), obj.getWeight() * this._friction);

            obj.addForce(
                'friction', 
                (obj.getVelocity().x > 0 ? -1 : 1)  * frictionX, 
                0, 
                'horizontal'
            )
        }
    }

    check (obj) {
        let _this = this;
        let forcesKey = this._forcesKey;

        if (this._tilesType == 'bottom' && obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y >= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue, delta } = _getBasicData(forcesKey);

            if (localLastPoint.y <= lastTargetValue + delta && localCurrentPoint.y >= currentTargetValue - delta) {
                _handleObj(forcesKey, localCurrentPoint, currentTargetValue);

                this._handleFriction(obj);

                return true;
            }
        } else if (this._tilesType == 'top' && obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y <= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue, delta } = _getBasicData(forcesKey);
            let objHeight = obj.getHeight();

            if (localLastPoint.y - objHeight >= lastTargetValue - delta && localCurrentPoint.y - objHeight <= currentTargetValue + delta) {
                _handleObj(forcesKey, localCurrentPoint, currentTargetValue + objHeight);

                return true;
            }
        } else if (this._tilesType == 'left' && obj.y > this.y && obj.y <= this.y + this._height && obj.getVelocity().x >= 0) {
            // 横向的默认为墙，则去除上边界的判断
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue, delta } = _getBasicData(forcesKey);

            if (localLastPoint.x <= lastTargetValue + delta && localCurrentPoint.x >= currentTargetValue - delta) {
                _handleObj(forcesKey, localCurrentPoint, currentTargetValue);

                return true;
            }
        } else if (this._tilesType == 'right' && obj.y > this.y && obj.y <= this.y + this._height && obj.getVelocity().x <= 0) {
            // 横向的默认为墙，则去除上边界的判断
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue, delta } = _getBasicData(forcesKey);

            if (localLastPoint.x >= lastTargetValue - delta && localCurrentPoint.x <= currentTargetValue + delta) {
                _handleObj(forcesKey, localCurrentPoint, currentTargetValue);

                return true;
            }
        }

        obj
        .removeForce(forcesKey)

        return false;

        function _getBasicData (type) {
            let localLastPoint = _this.toLocal(obj.getLastPoint(), _this.parent);
            let localCurrentPoint = _this.toLocal(obj.position, _this.parent);
            let lastTargetValue = _this._lineFunction(type == 'vertical-pressure' ? localLastPoint.x : localLastPoint.y);
            let currentTargetValue = _this._lineFunction(type == 'vertical-pressure' ? localCurrentPoint.x : localCurrentPoint.y);
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

        function _handleObj (type, localCurrentPoint, targetValue) {
            let composedForce = obj.getComposedForce();

            if (type == 'vertical-pressure') {
                if ((_this._tilesType == 'top' && composedForce.y < 0) || (_this._tilesType == 'bottom') && composedForce.y > 0) {
                    obj.addForce(type, 0, -composedForce.y, 'vertical');
                }

                obj.setVelocityY(0);

                localCurrentPoint.y = targetValue;
                obj.y = _this.parent.toLocal(localCurrentPoint, _this).y;
            } else if (type == 'horizontal-pressure') {
                if ((_this._tilesType == 'left' && composedForce.x > 0) || (_this._tilesType == 'right') && composedForce.x < 0) {
                    obj.addForce(type, -composedForce.x, 0, 'horizontal');
                }
                
                obj.setVelocityX(0);
                
                localCurrentPoint.x = targetValue;
                obj.x = _this.parent.toLocal(localCurrentPoint, _this).x;
            }
        }
    }

}
