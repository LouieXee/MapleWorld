import { isArray } from '../../utils';

const { Container } = PIXI;

const LINE_HEIGHT = 20;
const FONT_SIZE = 12;

export default class DisplayObjectDebuger extends Container {

    constructor (opt) {
        super();

        const {
            displayObj,
            lineHeight = LINE_HEIGHT,
            fontSize = FONT_SIZE,
            color
        } = opt;

        this._isTextVisible = true;
        this._displayObj = displayObj;
        this._lineHeight = lineHeight;
        this._textStyle = {
            fontSize,
            lineHeight,
            fill: color
        };
        this._texts = [];
    }

    toggleTextVisible () {
        this._isTextVisible = !this._isTextVisible;

        this._texts.forEach(text => { text.visible = this._isTextVisible; });
    }

    addText () {
        let newTexts = Array.prototype.slice.call(arguments, 0);
        let currentLength = this._texts.length;

        newTexts.forEach((text, index) => {
            text.x = -this._displayObj._width / 2;
            text.y = -this._displayObj._height - (currentLength + index + 1) * this._lineHeight;
            text.style = this._textStyle;
        })

        this._texts.push(...newTexts);
        this.addChild(...newTexts)
    }

    addTextAt (text, index) {
        if (!isArray(text)) {
            text = [text];
        }

        this._texts.splice(index, 0, ...text);

        this._texts.slice(index).forEach((text, i) => {
            text.x = -this._displayObj._width / 2;
            text.y = -this._displayObj._height - (index + i + 1) * this._lineHeight;
            text.style = this._textStyle;
        })

        this.addChild(...text);
    }

}
