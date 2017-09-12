import MapTiles from '../MapTiles';

export default class Ceiling extends MapTiles {

    constructor (opt) {
        const {
            texture = null,
            
            ...rest,
        } = opt;

        super({
            ...rest,
            tilesType: 'top',
            lineFunction: x => 0
        })
    }

}
