import {Grid} from './Grid';

interface Point {
    x: number;
    y: number;
    z?: number;
}

function isCollinear(p1: Point, p2: Point, p3: Point): boolean {
    const is2d = p1.z ? false : true;

    if (is2d) {
        return ((p3.y - p2.y) * (p2.x - p1.x) === (p2.y - p1.y) * (p3.x - p2.x));
    } else {
        const x21 = p2.x - p1.x;
        const x31 = p3.x - p1.x;
        const y21 = p2.y - p1.y;
        const y31 = p3.y - p1.y;
        const z21 = p2.z! - p1.z!;
        const z31 = p3.z! - p1.z!;
        const crossX = y21 * z31 - y31 * z21;
        const crossY = x31 * z21 - x21 * z31;
        const crossZ = x21 * y31 - x31 * y21;

        return (crossX === 0) && (crossY === 0) && (crossZ === 0);
    }
}

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
    },
    isCollinear,
    refinePathFromCollinearity: (path: { x: number[], y: number[], z?: number[] }, debugMode = false) => {
        const is2d = (!path.z || path.z!.length === 0) ? true : false;
        const length = path.x.length;

        if (length === 0) {
            console.error(`[Error] Length of x array is zero.`);
            return;
        }

        if (is2d) {
            if (path.y.length !== length) {
                console.error(`[Error] Inconsistent vector lengths of x and y arrays in the path.`);
                return;
            }
        } else {
            if (path.y.length !== length || path.z!.length !== length) {
                console.error(`[Error] Inconsistent vector lengths of x and y/z arrays in the path.`);
                return;
            }
        }
        
        const x: number[] = [];
        const y: number[] = [];
        const z: number[] = [];

        let log = '';
        for (let iPoint = 0; iPoint < length - 2; iPoint++) {
            const tempStartPoint = { x: path.x[iPoint], y: path.y[iPoint], z: is2d ? undefined : path.z![iPoint] };
            
            log += `[Add] Distinct point at ${iPoint}: ${tempStartPoint.x}, ${tempStartPoint.y}`;
            log += is2d ? '\n' : `, ${tempStartPoint.z}\n`;

            x.push(tempStartPoint.x);
            y.push(tempStartPoint.y);
            if (tempStartPoint.z) {
                z.push(tempStartPoint.z);
            }

            const nextPoint = { x: path.x[iPoint + 1], y: path.y[iPoint + 1], z: is2d ? undefined : path.z![iPoint + 1] };
            
            let isFinished = false;
            for (let jPoint = iPoint + 2; jPoint < length; jPoint++) {
                const futurePoint = { x: path.x[jPoint], y: path.y[jPoint], z: is2d ? undefined : path.z![jPoint] };
                
                if (isCollinear(tempStartPoint, nextPoint, futurePoint)) {
                    log += `[Status] Collinear from ${iPoint} to ${jPoint}\n`;

                    if (jPoint < length - 1) {
                        continue;
                    } else {
                        const lastPoint = { x: path.x[jPoint], y: path.y[jPoint], z: is2d ? undefined : path.z![jPoint] };
                        
                        log += `[Status] The last ${jPoint - iPoint + 1} points are collinear.\n`;
                        log += `[Add] Distinct point at ${jPoint}: ${lastPoint.x}, ${lastPoint.y}`;
                        log += is2d ? '\n' : `, ${lastPoint.z}\n`;

                        x.push(lastPoint.x);
                        y.push(lastPoint.y);
                        if (lastPoint.z) {
                            z.push(lastPoint.z);
                        }

                        isFinished = true;
                        break;
                    }
                } else {
                    iPoint = jPoint - 2;
                    log += `[Status] Update iPoint to ${iPoint}\n`;
                    break;
                }
            }

            if (isFinished) {
                break;
            }

            if (iPoint === length - 3) {
                const nextToLastPoint = { x: path.x[length - 2], y: path.y[length - 2], z: is2d ? undefined : path.z![length - 2] };
                const lastPoint = { x: path.x[length - 1], y: path.y[length - 1], z: is2d ? undefined : path.z![length - 1] };
                
                log += `[Add] Distinct point at ${length - 2}: ${nextToLastPoint.x}, ${nextToLastPoint.y}`;
                log += is2d ? '\n' : `, ${nextToLastPoint.z}\n`;
                log += `[Add] Distinct point at ${length - 1}: ${lastPoint.x}, ${lastPoint.y}`;
                log += is2d ? '\n' : `, ${lastPoint.z}\n`;

                x.push(nextToLastPoint.x, lastPoint.x);
                y.push(nextToLastPoint.y, lastPoint.y);
                if (nextToLastPoint.z && lastPoint.z) {
                    z.push(nextToLastPoint.z, lastPoint.z);
                }
            }
        }

        if (debugMode) {
            console.log(log);
        }

        return { x, y, z };
    }
}
