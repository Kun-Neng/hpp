import {IDimension} from './interface/IDimension';
import {IObstacles} from './interface/IObstacles';
import {IWaypoints} from './interface/IWaypoints';
import {Grid} from './Grid';
import {Model} from './Model';

enum TIME_TAG {
    START,
    END
};

export class AStar {
    readonly _is2d: boolean;
    readonly _obstacleArray: Array<Grid>;
    readonly _numObstacles: number;
    readonly _startGrid: Grid;
    readonly _stopGrid: Grid;
    readonly _allowDiagonal: boolean;
    readonly _openSet: Map<string, any>;
    readonly _Q: Map<string, any>;
    readonly _zCeil: number;
    readonly _zFloor: number;

    private _lastGridKey: string;
    private _message: string;

    constructor(scenario: { dimension: IDimension, waypoint: IWaypoints, data?: IObstacles, boundary?: { zCeil: number, zFloor: number } }) {
        const dimension = scenario.dimension;
        this._is2d = Model.is2d(dimension);
        this._obstacleArray = scenario.data ? Model.createObstacleArray(scenario.data, this._is2d) : [];
        this._numObstacles = this._obstacleArray.length;

        const waypoint = scenario.waypoint;
        // console.log(waypoint);

        if (!waypoint) {
            throw new Error('[Waypoint Error] waypoint is undefined.');
        }

        // console.log(Object.keys(waypoint).length);
        if (Object.keys(waypoint).length < 2 || !waypoint.hasOwnProperty("start") || !waypoint.hasOwnProperty("stop")) {
            throw new Error('[Waypoint Error] invalid waypoint format.');
        }

        const start = waypoint.start;
        const stop = waypoint.stop;
        this._startGrid = new Grid(start.x, start.y, start.z);
        this._stopGrid = new Grid(stop.x, stop.y, stop.z);
        this._lastGridKey = this._stopGrid.str();
        this._allowDiagonal = waypoint.allowDiagonal ?? false;

        const model = new Model(dimension, this._obstacleArray, waypoint);
        const isFast = true
        this._Q = model.createInitialQ(isFast);

        this._openSet = new Map<string, any>();
        this._openSet.set(this._startGrid.str(), this._Q.get(this._startGrid.str()));

        if (Model.gridsOnObstacles(this._obstacleArray, [this._startGrid, this._stopGrid])) {
            const message = "[Waypoint Error] start position or stop position is on the obstacle.";
            console.log(message);
            this._message = message;
        }

        this._zCeil = Number.MAX_SAFE_INTEGER;
        this._zFloor = Number.MIN_SAFE_INTEGER;
        const boundary = scenario.boundary;
        if (!this._is2d) {
            if (boundary) {
                this._zCeil = boundary.zCeil ?? Number.MAX_SAFE_INTEGER;
                this._zFloor = boundary.zFloor ?? Number.MIN_SAFE_INTEGER;

                if (!Model.isBoundaryAvailable(this._zFloor, this._startGrid.z, this._zCeil)) {
                    const message = "[Boundary Error] start position is out of boundary.";
                    console.log(message);
                    this._message = message;
                }
            }
        }

        this._message = "[Ready] No Results Yet.";
    }

    static findTheMinF(hashmap: Map<string, any>): { key: string | unknown, value: any } {
        let key = undefined;
        let value = undefined;
        let minF = Number.MAX_SAFE_INTEGER;
        hashmap.forEach((objInHashmap: any, keyInHashmap: string) => {
            // console.log(keyInHashmap + ':' + objInHashmap.f);
            if (objInHashmap.f < minF) {
                key = keyInHashmap;
                value = objInHashmap;
                minF = objInHashmap.f;
            }
        });

        return { key, value };
    }

    createPathFromFinalQ(finalQ: Map<string, any>): any {
        let finalObject = finalQ.get(this._stopGrid.str()) ?? finalQ.get(this._lastGridKey);

        const newXArray: number[] = [Number(finalObject.row)];
        const newYArray: number[] = [Number(finalObject.col)];
        const newZArray: number[] = this._is2d ? [0] : [Number(finalObject.z)];

        while (finalObject.prev) {
            finalObject = finalQ.get(finalObject.prev);

            const currentRow = Number(finalObject.row);
            const currentCol = Number(finalObject.col);
            const currentZ = this._is2d ? 0 : Number(finalObject.z);

            newXArray.push(currentRow);
            newYArray.push(currentCol);
            newZArray.push(currentZ);
        }

        return {
            x: newXArray.reverse(),
            y: newYArray.reverse(),
            z: newZArray.reverse()
        };
    }

    calculatePath(): any {
        const finalQ = new Map<string, any>();
        const visitedQ = new Map<string, any>();

        const calculateStartTime = this.getTime(TIME_TAG.START);

        let size = this._openSet.size;
        while (size > 0) {
            const obj = AStar.findTheMinF(this._openSet);
            const objKey = obj.key;
            const currentObj = obj.value;
            if (typeof objKey === 'string') {
                finalQ.set(objKey, currentObj);
                this._lastGridKey = objKey;
                this._openSet.delete(objKey);
            }

            let currentGrid;
            if (this._is2d) {
                currentGrid = new Grid(currentObj.row, currentObj.col);
            } else {
                currentGrid = new Grid(currentObj.row, currentObj.col, currentObj.z);
            }
            if (currentGrid.equal(this._stopGrid)) {
                const message = "[Done] Arrival! 🚀";
                console.log(message);
                this._message = message;
                break;
            }

            for (let shiftRow = -1; shiftRow <= 1; shiftRow++) {
                for (let shiftCol = -1; shiftCol <= 1; shiftCol++) {
                    if (this._is2d) {
                        const isNotDiagonal = (shiftRow === 0 || shiftCol === 0) && (shiftRow != shiftCol);
                        const isDiagonal = !(shiftRow === 0 && shiftCol === 0);

                        const isAllowed = this._allowDiagonal ? isDiagonal : isNotDiagonal;
                        if (isAllowed) {
                            const neighborGrid = currentGrid.shift(shiftRow, shiftCol);
                            let neighbor = this._Q.get(neighborGrid.str());

                            if (neighbor && !finalQ.get(neighborGrid.str())) {
                                visitedQ.set(neighborGrid.str(), neighbor);

                                if (this._openSet.get(neighborGrid.str())) {
                                    this._openSet.set(neighborGrid.str(), neighbor);
                                }

                                const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol);
                                const alt = currentObj.dist + dist;
                                if (alt < neighbor.dist) {
                                    neighbor.dist = alt;
                                    const distX = this._stopGrid.x - neighbor.row;
                                    const distY = this._stopGrid.y - neighbor.col;
                                    neighbor.f = alt + Math.abs(distX) + Math.abs(distY);
                                    // neighbor.f = alt + Math.sqrt(distX * distX + distY * distY);
                                    neighbor.prev = currentGrid.str();
                                    this._openSet.set(neighborGrid.str(), neighbor);
                                }
                            }
                        }
                    } else {
                        for (let shiftZ = -1; shiftZ <= 1; shiftZ++) {
                            const isNotDiagonal = (shiftRow === 0 || shiftCol === 0) && (shiftRow != shiftCol) || (shiftRow === 0 && shiftCol === 0);
                            const isDiagonal = !(shiftRow === 0 && shiftCol === 0 && shiftZ === 0);

                            const isAllowed = this._allowDiagonal ? isDiagonal : isNotDiagonal;
                            if (isAllowed) {
                                const neighborGrid = currentGrid.shift(shiftRow, shiftCol, shiftZ);

                                if (neighborGrid.isOutOfBound({boundZ: [this._zFloor, this._zCeil]})) {
                                    continue;
                                }

                                // Full search (time-consuming) = 2D

                                // Fast search
                                if (this._obstacleArray.findIndex(obstacle => {
                                    return obstacle.equal(neighborGrid);
                                }) !== -1) {
                                    // Find out an obstacle on the point
                                    continue;
                                }

                                if (!finalQ.has(neighborGrid.str())) {
                                    let neighborObj = visitedQ.get(neighborGrid.str());
                                    if (!neighborObj) {
                                        neighborObj = {
                                            row: neighborGrid.x,
                                            col: neighborGrid.y,
                                            z: neighborGrid.z,
                                            prev: undefined,
                                            dist: Number.MAX_SAFE_INTEGER,
                                            f: Number.MAX_SAFE_INTEGER
                                        };
                                        visitedQ.set(neighborGrid.str(), neighborObj);
                                    }

                                    const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol + shiftZ * shiftZ);
                                    const alt = currentObj.dist + dist;
                                    if (!this._openSet.has(neighborGrid.str())) {
                                        this._openSet.set(neighborGrid.str(), neighborObj);
                                    }
                                    if (alt < neighborObj.dist) {
                                        neighborObj.dist = alt;
                                        // neighborObj.f = alt + Math.abs(this._stopGrid.x - neighborObj.row) + Math.abs(this._stopGrid.y - neighborObj.col) + Math.abs(this._stopGrid.z - neighborObj.z);
                                        let leftX = this._stopGrid.x - neighborObj.row;
                                        let leftY = this._stopGrid.y - neighborObj.col;
                                        let leftZ = this._stopGrid.z - neighborObj.z;
                                        neighborObj.f = alt + Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
                                        neighborObj.prev = currentGrid.str();
                                        this._openSet.set(neighborGrid.str(), neighborObj);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            size = this._openSet.size;
        }

        const calculateEndTime = this.getTime(TIME_TAG.END);
        // const elapsedTimeString = this.elapsedTimeString(calculateStartTime, calculateEndTime);

        return {
            "visited_Q": visitedQ,
            "final_Q": finalQ,
            "elapsed_ms": calculateEndTime - calculateStartTime,
            "path": this.createPathFromFinalQ(finalQ),
            "message": this._message
        }
    }

    private getTimeString(ms: number): string {
        return new Date(ms).toTimeString();
    };

    // private elapsedTimeString(startTime: number, endTime: number): string {
    //     const duration = endTime - startTime;
    //     if (duration >= 60*1000) {
    //         return `${duration/(60*1000)} minutes`;
    //     } else if (duration >= 1000) {
    //         return `${duration/1000} seconds`;
    //     } else {
    //         return `${duration} milliseconds`;
    //     }
    // };

    private getTime(tag: TIME_TAG): number {
        const now = Date.now();

        console.log(`[${this.getTimeString(now)}] path finding algorithm ${TIME_TAG[tag]}.`);

        return now;
    }
}
