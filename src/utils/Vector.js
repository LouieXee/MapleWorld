import { isNumber } from './common';

export class Vector {

    constructor (x, y) {
        this.x = x;
        this.y = y;
        this._tag = 'none';
    }

    setTag (tag) {
        this._tag = tag;

        return this;
    }

    getTag () {
        return this._tag;
    }

    add (vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    sub (vector) {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    mul (num) {
        this.x *= num;
        this.y *= num;

        return this;
    }

    div (num) {
        this.x /= num;
        this.y /= num;

        return this;
    }

    invertX() {
        this.x = -this.x;

        return this;
    }

    invertY() {
        this.y = -this.y;

        return this;
    }

    length(length) {
        if (!isNumber(length)) {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        let nowLength = this.length();
        
        this.x *= ( length / nowLength );
        this.y *= ( length / nowLength );

        return this;
    }

    clone() {
        return new Vector(this.x, this.y).setTag(this._tag);
    }

}