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
    },
    createPathFromFinalQ: (finalQ: Map<string, Grid>, finalGrid: Grid) => {
        const is2d = finalGrid.is2d;
        const newXArray: number[] = [Number(finalGrid.x)];
        const newYArray: number[] = [Number(finalGrid.y)];
        const newZArray: number[] = is2d ? [] : [Number(finalGrid.z)];

        while (finalGrid && finalGrid.prev) {
            finalGrid = finalQ.get(finalGrid.prev.str()) as Grid;
            const currentRow = Number(finalGrid.x);
            const currentCol = Number(finalGrid.y);
            const currentZ = is2d ? 0 : Number(finalGrid.z);

            newXArray.push(currentRow);
            newYArray.push(currentCol);

            if (!is2d) {
                newZArray.push(currentZ);
            }
        }

        return {
            x: newXArray.reverse(),
            y: newYArray.reverse(),
            z: newZArray.reverse()
        };
    }
}
