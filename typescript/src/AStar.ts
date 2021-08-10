import {IDimension} from './interface/IDimension';
import {IObstacles} from './interface/IObstacles';
import {IWaypoints} from './interface/IWaypoints';
import {IOptions} from './interface/IOptions';
import {Node} from './Node';
import {Model} from './Model';
import Tools from './Tools';

enum TIME_TAG {
    START,
    END
};

export class AStar {
    readonly _is2d: boolean;
    readonly _obstacleArray: Array<Node>;
    readonly _numObstacles: number;
    readonly _startNode: Node;
    readonly _stopNode: Node;
    readonly _allowDiagonal: boolean;
    readonly _openSet: Map<string, Node>;
    readonly _Q: Map<string, Node>;
    readonly _zCeil: number;
    readonly _zFloor: number;

    readonly _debugMode: boolean;
    readonly _type: string;

    private _lastNodeKey: string;
    private _message: string;

    constructor(scenario: { dimension: IDimension, waypoint: IWaypoints, data?: IObstacles, boundary?: { zCeil?: number, zFloor?: number } }, options?: IOptions) {
        const dimension = scenario.dimension;
        this._is2d = Model.is2d(dimension);
        this._obstacleArray = Model.createObstacleArray(scenario.data);
        this._numObstacles = this._obstacleArray.length;

        const waypoint = scenario.waypoint;
        // console.log(waypoint);

        if (!options) {
            this._debugMode = false;
            this._type = 'fast';
        } else {
            this._debugMode = options.debugMode ? options.debugMode : false;
            this._type = options.type ? options.type === 'original' ? 'original': 'fast' : 'fast';
        }

        const model = new Model(dimension, this._obstacleArray, waypoint, this._debugMode);
        this._Q = model.createInitialQ(this._type === 'fast');

        const start = waypoint.start;
        const stop = waypoint.stop;
        this._startNode = this._is2d ?
            new Node(start.x, start.y).setAsStartNode() :
            new Node(start.x, start.y, start.z).setAsStartNode();
        this._stopNode = this._is2d ?
            new Node(stop.x, stop.y) :
            new Node(stop.x, stop.y, stop.z);
        this._lastNodeKey = this._stopNode.str();
        this._allowDiagonal = waypoint.allowDiagonal ?? false;

        this._openSet = new Map<string, Node>();
        this._openSet.set(this._startNode.str(), this._startNode);

        if (Model.nodesOnObstacles(this._obstacleArray, [this._startNode, this._stopNode])) {
            const message = "[Waypoint Error] start position or stop position is on some obstacle.";
            console.log(message);
            this._message = message;
        }

        this._zCeil = Number.MAX_SAFE_INTEGER;
        this._zFloor = Number.MIN_SAFE_INTEGER;
        const boundary = scenario.boundary;
        if (!this._is2d) {
            if (boundary) {
                this._zCeil = boundary.zCeil ?? this._zCeil;
                this._zFloor = boundary.zFloor ?? this._zFloor;

                if (!Model.isBoundaryAvailable(this._zFloor, this._startNode.z, this._zCeil)) {
                    const message = "[Boundary Error] start position is out of boundary.";
                    console.log(message);
                    this._message = message;
                }
            }
        }

        this._message = "[Ready] No Results.";
    }

    calculatePath(): any {
        const finalQ = new Map<string, Node>();
        const visitedQ = new Map<string, Node>();

        const calculateStartTime = this.getTime(TIME_TAG.START);

        let size = this._openSet.size;
        while (size > 0) {
            const obj = Tools.findTheMinimum(this._openSet, 'f');
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

                                if (!this._openSet.has(neighborNode.str())) {
                                    this._openSet.set(neighborNode.str(), neighbor);
                                }

                                const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol);
                                const alt = currentNode.dist + dist;
                                if (alt < neighbor.dist) {
                                    neighbor.dist = alt;
                                    neighbor.f = alt + neighbor.manhattanDistanceTo(this._stopNode);
                                    // neighbor.f = alt + Math.sqrt(distX * distX + distY * distY);
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
                                        neighborObj.f = alt + neighborObj.manhattanDistanceTo(this._stopNode);
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
        const refinedPath = Tools.refinePathFromCollinearity(path);

        return {
            "visited_Q": visitedQ,
            "final_Q": finalQ,
            "elapsed_ms": elapsedMS,
            "path": path,
            "refined_path": refinedPath,
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
