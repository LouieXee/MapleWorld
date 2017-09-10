const { Sprite, Graphics, particles } = PIXI;
const { ParticleContainer } = particles;

export default class MapTiles extends Sprite {

    constructor (opt) {
        super();

        const {
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            tilesType = 'bottom',
            debug = false,
            lineFunction = x => 0
        } = opt;

        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
        this._tilesType = tilesType;
        this._lineFunction = lineFunction;

        this._forcesKey = (tilesType == 'bottom' || tilesType == 'top') && 'bottomOrTop'
                        || (tilesType == 'left' || tilesType == 'right') && 'leftOrRight'

        this._debug = debug;
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

    /*
        @description 因为toLocal和toGlobal的转化会有小数点后数位的差异以及上坡时的特殊处理，所以在最后比较时会有一个maxMoveSpeed的上下浮动
    */
    check (obj) {
        let _this = this;
        let forcesKey = this._forcesKey;

        if (this._tilesType == 'bottom' && obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y >= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue } = _getBasicData(forcesKey);

            if (localLastPoint.y <= lastTargetValue + obj.getMaxMoveSpeed() && localCurrentPoint.y >= currentTargetValue - obj.getMaxMoveSpeed()) {
                _handleObj(forcesKey, localCurrentPoint, currentTargetValue);

                return true;
            }
        } else if (this._tilesType == 'top' && obj.x >= this.x && obj.x <= this.x + this._width && obj.getVelocity().y <= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue } = _getBasicData(forcesKey);
            let objHeight = obj.getHeight();

            if (localLastPoint.y - objHeight >= lastTargetValue - obj.getMaxMoveSpeed() && localCurrentPoint.y - objHeight <= currentTargetValue + obj.getMaxMoveSpeed()) {
                _handleObj(forcesKey, localCurrentPoint, currentTargetValue + objHeight);

                return true;
            }
        } else if (this._tilesType == 'left' && obj.y >= this.y && obj.y <= this.y + this._height && obj.getVelocity().x >= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue } = _getBasicData(forcesKey);

            if (localLastPoint.x <= lastTargetValue + Math.abs(obj.getVelocity().x) && localCurrentPoint.x >= currentTargetValue - Math.abs(obj.getVelocity().x)) {
                _handleObj(forcesKey, localCurrentPoint, currentTargetValue);

                return true;
            }
        } else if (this._tilesType == 'right' && obj.y >= this.y && obj.y <= this.y + this._height && obj.getVelocity().x <= 0) {
            let { localLastPoint, localCurrentPoint, lastTargetValue, currentTargetValue } = _getBasicData(forcesKey);

            if (localLastPoint.x >= lastTargetValue - Math.abs(obj.getVelocity().x) && localCurrentPoint.x <= currentTargetValue + Math.abs(obj.getVelocity().x)) {
                _handleObj(forcesKey, localCurrentPoint, currentTargetValue);

                return true;
            }
        }

        obj.removeForce(forcesKey);

        return false;

        function _getBasicData (type) {
            let localLastPoint = _this.toLocal(obj.getLastPoint());
            let localCurrentPoint = _this.toLocal(obj.position);
            let lastTargetValue = _this._lineFunction(type == 'bottomOrTop' ? localLastPoint.x : localLastPoint.y);
            let currentTargetValue = _this._lineFunction(type == 'bottomOrTop' ? localCurrentPoint.x : localCurrentPoint.y);

            return {
                localLastPoint,
                localCurrentPoint,
                lastTargetValue,
                currentTargetValue
            };
        }

        function _handleObj (type, localCurrentPoint, targetValue) {
            let force = obj.composeForce();

            if (type == 'bottomOrTop') {
                obj
                .addForce(type, 0, -force.y, 'vertical')
                .setVelocityY(0);

                localCurrentPoint.y = targetValue;
                obj.y = _this.toGlobal(localCurrentPoint).y;
            } else if (type == 'leftOrRight') {
                obj
                .addForce(type, -force.x, 0, 'horizontal')
                .setVelocityX(0);

                localCurrentPoint.x = targetValue;
                obj.x = _this.toGlobal(localCurrentPoint).x;
            }
        }
    }

}
