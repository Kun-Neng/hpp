import {Node} from './Node';

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
    isMovingStraight: (direction: number[]) => {
        if (direction.length === 2) {
            return direction[0] === 0 || direction[1] === 0;
        } else if (direction.length === 3) {
            return (direction[0] === 0 && direction[1] === 0) ||
                (direction[0] === 0 && direction[2] === 0) ||
                (direction[1] === 0 && direction[2] === 0);
        } else {
            console.error(`Invalid direction ${direction}`);
            return false;
        }
    },
    findTheMinimum: (hashmap: Map<string, Node>, crux: string) => {
        let key = '';
        let value: any;
        let minimum = Number.MAX_SAFE_INTEGER;
        hashmap.forEach((objInHashmap: Node, keyInHashmap: string) => {
            // console.log(keyInHashmap + ':' + objInHashmap.getCrux(crux));
            if (objInHashmap.getCrux(crux) <= minimum) {
                key = keyInHashmap;
                value = objInHashmap;
                minimum = objInHashmap.getCrux(crux);
            }
        });

        return { key, value };
    },
    intersect: (groupCenter: Node, obstacleNode: Node, radius: number = 1, isFlat: boolean = true) => {
        const [boxMinX, boxMaxX, boxMinY, boxMaxY] = [
            obstacleNode.x - 0.5, obstacleNode.x + 0.5,
            obstacleNode.y - 0.5, obstacleNode.y + 0.5
        ];
        const x = Math.max(boxMinX, Math.min(groupCenter.x, boxMaxX));
        const y = Math.max(boxMinY, Math.min(groupCenter.y, boxMaxY));

        if (isFlat) {
            const flatCenterNode = new Node(groupCenter.x, groupCenter.y);
            const closestPoint = new Node(x, y);
            // const distance = Math.sqrt(Math.pow(x - groupCenter.x, 2) + Math.pow(y - groupCenter.y, 2));
            const distance = flatCenterNode.distanceTo(closestPoint);
            return distance <= radius;
        } else {
            const [boxMinZ, boxMaxZ] = [obstacleNode.z - 0.5, obstacleNode.z + 0.5];
            const z = Math.max(boxMinZ, Math.min(groupCenter.z, boxMaxZ));
            const closestPoint = new Node(x, y, z);
            const distance = groupCenter.distanceTo(closestPoint);
            return distance <= radius;
        }
    },
    createPathFromFinalQ: (finalQ: Map<string, Node>, finalNode: Node) => {
        const is2d = finalNode.is2d;
        const newXArray: number[] = [Number(finalNode.x)];
        const newYArray: number[] = [Number(finalNode.y)];
        const newZArray: number[] = is2d ? [] : [Number(finalNode.z)];

        while (finalNode && finalNode.prev) {
            finalNode = finalQ.get(finalNode.prev.str()) as Node;
            const currentRow = Number(finalNode.x);
            const currentCol = Number(finalNode.y);
            const currentZ = is2d ? 0 : Number(finalNode.z);

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
