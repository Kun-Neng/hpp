import {IDimension} from './interface/IDimension';
import {IObstacles} from './interface/IObstacles';
import {IWaypoints} from './interface/IWaypoints';
import {Node} from './Node';
import {Model} from './Model';
import Tools from './Tools';

enum TIME_TAG {
    START,
    END
};

export class Dijkstra {
    readonly _is2d: boolean;
    readonly _obstacleArray: Array<Node>;
    readonly _startNode: Node;
    readonly _stopNode: Node;
    readonly _allowDiagonal: boolean;
    readonly _openSet: Map<string, Node>;
    readonly _Q: Map<string, Node>;
    readonly _zCeil: number;
    readonly _zFloor: number;

    private _lastNodeKey: string;
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
        this._startNode = this._is2d ?
            new Node(start.x, start.y).setAsStartNode() :
            new Node(start.x, start.y, start.z).setAsStartNode();
        this._stopNode = new Node(stop.x, stop.y, stop.z);
        this._lastNodeKey = this._stopNode.str();
        this._allowDiagonal = waypoint.allowDiagonal ?? false;

        this._openSet = new Map<string, Node>();
        this._openSet.set(this._startNode.str(), this._startNode);

        this._zCeil = Number.MAX_SAFE_INTEGER;
        this._zFloor = Number.MIN_SAFE_INTEGER;

        this._message = "[Ready] No Results.";
    }

    calculatePath(): any {
        const finalQ = new Map<string, Node>();
        const visitedQ = new Map<string, Node>();

        const calculateStartTime = this.getTime(TIME_TAG.START);

        let size = this._openSet.size;
        while (size > 0) {
            const obj = Tools.findTheMinimum(this._openSet, 'dist');
            const objKey = obj.key;
            const currentNode = obj.value;
            finalQ.set(objKey, currentNode);
            this._lastNodeKey = objKey;
            this._openSet.delete(objKey);

            if (currentNode.equal(this._stopNode)) {
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
                            const neighborNode = currentNode.shift(shiftRow, shiftCol);
                            let neighbor = this._Q.get(neighborNode.str());

                            if (neighbor && !finalQ.get(neighborNode.str())) {
                                visitedQ.set(neighborNode.str(), neighbor);

                                if (this._openSet.get(neighborNode.str())) {
                                    this._openSet.set(neighborNode.str(), neighbor);
                                }

                                const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol);
                                const alt = currentNode.dist + dist;
                                if (alt < neighbor.dist) {
                                    neighbor.dist = alt;
                                    neighbor.prev = currentNode;
                                    this._openSet.set(neighborNode.str(), neighbor);
                                }
                            }
                        }
                    } else {
                        for (let shiftZ = -1; shiftZ <= 1; shiftZ++) {
                            const isNotDiagonal = (shiftRow === 0 || shiftCol === 0) && (shiftRow != shiftCol) || (shiftRow === 0 && shiftCol === 0);
                            const isDiagonal = !(shiftRow === 0 && shiftCol === 0 && shiftZ === 0);

                            const isAllowed = this._allowDiagonal ? isDiagonal : isNotDiagonal;
                            if (isAllowed) {
                                const neighborNode = currentNode.shift(shiftRow, shiftCol, shiftZ);

                                if (neighborNode.isOutOfBound({boundZ: [this._zFloor, this._zCeil]})) {
                                    continue;
                                }

                                // Full search (time-consuming) = 2D

                                // Fast search
                                if (this._obstacleArray.findIndex(obstacle => {
                                    return obstacle.equal(neighborNode);
                                }) !== -1) {
                                    // Find out an obstacle on the point
                                    continue;
                                }

                                if (!finalQ.has(neighborNode.str())) {
                                    let neighborObj = visitedQ.get(neighborNode.str());
                                    if (!neighborObj) {
                                        neighborObj = new Node(neighborNode.x, neighborNode.y, neighborNode.z);
                                        visitedQ.set(neighborNode.str(), neighborObj);
                                    }

                                    const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol + shiftZ * shiftZ);
                                    const alt = currentNode.dist + dist;
                                    if (!this._openSet.has(neighborNode.str())) {
                                        this._openSet.set(neighborNode.str(), neighborObj);
                                    }
                                    if (alt < neighborObj.dist) {
                                        neighborObj.dist = alt;
                                        neighborObj.prev = currentNode;
                                        this._openSet.set(neighborNode.str(), neighborObj);
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
        const finalNode = finalQ.get(this._lastNodeKey);
        const path = Tools.createPathFromFinalQ(finalQ, finalNode!);

        return {
            "visited_Q": visitedQ,
            "final_Q": finalQ,
            "elapsed_ms": elapsedMS,
            "path": path,
            "message": this._message
        };
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
