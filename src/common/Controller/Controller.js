export default class Controller {

    constructor (target) {
        this.target = target;

        this._bind();
    }

    _bind () {
        window.addEventListener('keydown', e => {
            this.target.setKeys(e.keyCode, true);
        })

        window.addEventListener('keyup', e => {
            this.target.setKeys(e.keyCode, false);
        })
    }

}
