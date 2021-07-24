import {IDimension} from './interface/IDimension';
import {IObstacles} from './interface/IObstacles';
import {IWaypoints} from './interface/IWaypoints';
import {Grid} from './Grid';
import {Model} from './Model';
import Tools from './Tools';

enum TIME_TAG {
    START,
    END
};

export class Dijkstra {
    readonly _is2d: boolean;
    readonly _obstacleArray: Array<Grid>;
    readonly _startGrid: Grid;
    readonly _stopGrid: Grid;
    readonly _allowDiagonal: boolean;
    readonly _openSet: Map<string, Grid>;
    readonly _Q: Map<string, Grid>;
    readonly _zCeil: number;
    readonly _zFloor: number;

    private _lastGridKey: string;
    private _message: string;

    constructor(scenario: { dimension: IDimension, waypoint: IWaypoints, data?: IObstacles, boundary?: { zCeil?: number, zFloor?: number } }) {
        const dimension = scenario.dimension;
        this._is2d = Model.is2d(dimension);
        this._obstacleArray = Model.createObstacleArray(scenario.data);

        const waypoint = scenario.waypoint;
        // console.log(waypoint);

        const model = new Model(dimension, this._obstacleArray, waypoint, true);
        this._Q = model.createInitialQ(false);

        const start = waypoint.start;
        const stop = waypoint.stop;
        this._startGrid = this._is2d ?
            new Grid(start.x, start.y).setAsStartGrid() :
            new Grid(start.x, start.y, start.z).setAsStartGrid();
        this._stopGrid = new Grid(stop.x, stop.y, stop.z);
        this._lastGridKey = this._stopGrid.str();
        this._allowDiagonal = waypoint.allowDiagonal ?? false;

        this._openSet = new Map<string, Grid>();
        this._openSet.set(this._startGrid.str(), this._startGrid);

        this._zCeil = Number.MAX_SAFE_INTEGER;
        this._zFloor = Number.MIN_SAFE_INTEGER;

        this._message = "[Ready] No Results.";
    }

    calculatePath(): any {
        const finalQ = new Map<string, Grid>();
        const visitedQ = new Map<string, Grid>();

        const calculateStartTime = this.getTime(TIME_TAG.START);

        let size = this._openSet.size;
        while (size > 0) {
            const obj = Tools.findTheMinimum(this._openSet, 'dist');
            const objKey = obj.key;
            const currentGrid = obj.value;
            finalQ.set(objKey, currentGrid);
            this._lastGridKey = objKey;
            this._openSet.delete(objKey);

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
                                const alt = currentGrid.dist + dist;
                                if (alt < neighbor.dist) {
                                    neighbor.dist = alt;
                                    neighbor.prev = currentGrid;
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
                                        neighborObj = new Grid(neighborGrid.x, neighborGrid.y, neighborGrid.z);
                                        visitedQ.set(neighborGrid.str(), neighborObj);
                                    }

                                    const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol + shiftZ * shiftZ);
                                    const alt = currentGrid.dist + dist;
                                    if (!this._openSet.has(neighborGrid.str())) {
                                        this._openSet.set(neighborGrid.str(), neighborObj);
                                    }
                                    if (alt < neighborObj.dist) {
                                        neighborObj.dist = alt;
                                        neighborObj.prev = currentGrid;
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
        const elapsedMS = calculateEndTime - calculateStartTime;
        const finalGrid = finalQ.get(this._lastGridKey);
        const path = Tools.createPathFromFinalQ(finalQ, finalGrid!);

        return {
            "visited_Q": visitedQ,
            "final_Q": finalQ,
            "elapsed_ms": elapsedMS,
            "path": path,
            "message": this._message
        }
    }

    private getTimeString(ms: number): string {
        return new Date(ms).toTimeString();
    };

    private getTime(tag: TIME_TAG): number {
        const now = Date.now();

        console.log(`[${this.getTimeString(now)}] path finding algorithm ${TIME_TAG[tag]}.`);

        return now;
    }
}
