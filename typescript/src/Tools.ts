import {Grid} from './Grid';

export default {
    findTheMinimum: (hashmap: Map<string, Grid>, crux: string) => {
        let key = '';
        let value: any;
        let minimum = Number.MAX_SAFE_INTEGER;
        hashmap.forEach((objInHashmap: Grid, keyInHashmap: string) => {
            // console.log(keyInHashmap + ':' + objInHashmap.getCrux(crux));
            if (objInHashmap.getCrux(crux) <= minimum) {
                key = keyInHashmap;
                value = objInHashmap;
                minimum = objInHashmap.getCrux(crux);
            }
        });

        return { key, value };
    }
}
