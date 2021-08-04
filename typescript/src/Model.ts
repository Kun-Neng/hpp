import {IDimension} from './interface/IDimension';
import {IObstacles} from './interface/IObstacles';
import {IWaypoints} from './interface/IWaypoints';
import {Node} from './Node';

export class Model {
    readonly _dimension: IDimension;
    readonly _is2d: boolean;
    readonly _obstacleArray: Array<Node>;
    readonly _startNode: Node;
    readonly _stopNode: Node;
    readonly _dist: number;
    private _initQ: Map<string, Node>;

    readonly _debugMode: boolean;

    constructor(dimension: IDimension, obstacleArray: Array<Node>, waypoint: IWaypoints, debugMode = false) {
        this._dimension = dimension;
        this._is2d = Model.is2d(this._dimension);

        this._obstacleArray = obstacleArray;

        const start = waypoint.start;
        const stop = waypoint.stop;
        this._startNode = new Node(start.x, start.y, start.z).setAsStartNode();
        this._stopNode = new Node(stop.x, stop.y, stop.z);
        this._dist = this._startNode.distanceTo(this._stopNode);

        this._initQ = new Map<string, Node>();

        this._debugMode = debugMode
    }

    static is2d(dimension: IDimension): boolean {
        if (!dimension.z) {
            return true;
        }

        if (dimension.z <= 0) {
            return true;
        }

        return false;
    }

    static createObstacleArray(data?: IObstacles): Array<Node> {
        const obstacleArray = new Array<Node>();
        if (!data) {
            return obstacleArray;
        }

        if (data.size === 0) {
            return obstacleArray;
        }

        const size = data.size;

        const xArray = data.x;
        const yArray = data.y;

        if (!data.z) {
            for (let i = 0; i < size; i++) {
                obstacleArray.push(new Node(xArray[i], yArray[i]));
            }
        } else {
            const zArray = data.z;
            for (let i = 0; i < size; i++) {
                obstacleArray.push(new Node(xArray[i], yArray[i], zArray[i]));
            }
        }

        return obstacleArray;
    }

    static nodesOnObstacles(array: Array<Node>, nodes: Array<Node>): boolean {
        const BreakException = {};
        try {
            array.forEach(obstacle => {
                nodes.forEach(node => {
                    if (node.equal(obstacle)) {
                        console.log(`the point ${node.str()} is located on the obstacle.`);
                        throw BreakException;
                    }
                });
            });
        } catch (e) {
            // if (e !== BreakException) {
            //     throw e;
            // }

            return true;
        }

        // console.log(`no point is located on the obstacle.`);
        return false;
    }

    static isBoundaryAvailable(lowerBound: number, value: number, upperBound: number): boolean {
        if (value <= lowerBound) {
            console.log("value <= lower_bound");
            return false;
        }

        if (value >= upperBound) {
            console.log("value >= upper_bound");
            return false;
        }

        return (lowerBound + 1 < upperBound);
    }

    createInitialQ(isFast: boolean = true): Map<string, Node> {
        const x = Number(this._dimension.x);
        const y = Number(this._dimension.y);

        const calculateStartTime = Date.now();

        if (this._is2d) {
            for (let row = 0; row < x; row++) {
                for (let col = 0; col < y; col++) {
                    if (this._obstacleArray.findIndex((obstacle: Node) => {
                        return (obstacle.x === row) && (obstacle.y === col);
                    }) !== -1) {
                        continue;
                    } else {
                        this.updateInitQ(row, col);
                    }
                }
            }
        } else {
            const z = Number(this._dimension.z);

            if (isFast) {
                const fValue = this._dist;
                this._startNode.f = fValue;
                this._initQ.set(this._startNode.str(), this._startNode);
            } else {
                for (let row = 0; row < x; row++) {
                    for (let col = 0; col < y; col++) {
                        for (let iz = 0; iz < z; iz++) {
                            if (this._obstacleArray.findIndex((obstacle: Node) => {
                                return (obstacle.x === row) && (obstacle.y === col) && (obstacle.z === iz);
                            }) !== -1) {
                                continue;
                            } else {
                                this.updateInitQ(row, col, iz);
                            }
                        }
                    }
                }
            }
        }

        const calculateEndTime = Date.now();
        if (this._debugMode) {
            console.log(`create_initial_Q time: ${calculateEndTime - calculateStartTime} ms`);
        }

        return this._initQ;
    }

    private updateInitQ(row: number, col: number, z?: number | undefined): void {
        const cellNode = typeof z === 'number' ? new Node(row, col, z) : new Node(row, col);

        if (cellNode.equal(this._startNode)) {
            cellNode.dist = 0;
            cellNode.f = cellNode.dist + this._dist;
        }

        this._initQ.set(cellNode.str(), cellNode);
    }
}
