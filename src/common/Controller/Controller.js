export default class Controller {

    constructor (target) {
        this.target = target;

        this._bind();
    }

    _bind () {
        window.addEventListener('keydown', e => {
            console.log(e)
        })
    }

}
