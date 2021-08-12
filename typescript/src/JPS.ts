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

export class JPS {
    readonly _dimension: IDimension;
    readonly _is2d: boolean;
    readonly _obstacleSet: Set<string>;
    readonly _startNode: Node;
    readonly _stopNode: Node;
    readonly _openSet: Map<string, Node>;

    private _visitedQ: Map<string, Node>;
    private _finalQ: Map<string, Node>;

    private _lastNodeKey: string;
    private _message: string;

    constructor(scenario: { dimension: IDimension, waypoint: IWaypoints, data?: IObstacles }) {
        this._dimension = scenario.dimension;
        this._is2d = Model.is2d(this._dimension);
        this._obstacleSet = Model.createObstacleSet(scenario.data);

        const waypoint = scenario.waypoint;
        // console.log(waypoint);

        const start = waypoint.start;
        const stop = waypoint.stop;
        this._startNode = this._is2d ?
            new Node(start.x, start.y).setAsStartNode() :
            new Node(start.x, start.y, start.z).setAsStartNode();
        this._stopNode = this._is2d ?
            new Node(stop.x, stop.y) :
            new Node(stop.x, stop.y, stop.z);
        this._lastNodeKey = this._stopNode.str();

        this._openSet = new Map<string, Node>();
        this._openSet.set(this._startNode.str(), this._startNode);
        this._visitedQ = new Map<string, Node>();
        this._finalQ = new Map<string, Node>();

        this._message = "[Ready] No Results.";
    }

    getNeighbors(currNode: Node): Node[] {
        // console.log(`[getNeighbors] from ${currNode.x},${currNode.y}`);
        const prevNode = currNode.prev;
        const directionToNode = prevNode ? currNode.directionFrom(prevNode) : [0, 0];
        const nextNode = currNode.shift(directionToNode[0], directionToNode[1]);

        const neighbors = [];
        for (let shiftX = -1; shiftX <= 1; shiftX++) {
            for (let shiftY = -1; shiftY <= 1; shiftY++) {
                const neighbor = currNode.shift(shiftX, shiftY);

                if (neighbor.equal(currNode)) {
                    continue;
                }

                if (this.checkIsOutOfBound(neighbor)) {
                    continue;
                }

                if (this.checkIsObstacle(neighbor)) {
                    neighbor.isObstacle = true;
                } else {
                    if (!prevNode) {
                        // start condition
                        neighbor.isNatural = true;
                    } else {
                        if (Tools.isMovingStraight(directionToNode)) {
                            neighbor.isNatural = neighbor.equal(nextNode);
                        } else {
                            neighbor.isNatural = (neighbor.equal(nextNode) ||
                                (neighbor.x === currNode.x) && (neighbor.y === nextNode.y) ||
                                (neighbor.x === nextNode.x) && (neighbor.y === currNode.y));
                        }
                    }
                }

                neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

    /*checkIsNodeNatural(currNode: Node, neighbor: Node): boolean {
        const prevNode = currNode.prev;

        if (prevNode) {
            const directionToNode = currNode.directionFrom(prevNode);
            const nextNode = currNode.shift(directionToNode[0], directionToNode[1]);

            if (Tools.isMovingStraight(directionToNode)) {
                return neighbor.equal(nextNode);
            } else {
                return (neighbor.equal(nextNode) ||
                    (neighbor.x === currNode.x) && (neighbor.y === nextNode.y) ||
                    (neighbor.x === nextNode.x) && (neighbor.y === currNode.y));
            }
        } else {
            // start condition
            return true;
        }
    }*/

    prune(currNode: Node, neighbors: Node[]): Node[] {
        const pNode = currNode.prev;

        const candidateNeighbors = neighbors.filter(neighbor => neighbor.isNatural === true);
        const nonnaturalNeighbors = neighbors.filter(neighbor => neighbor.isObstacle === false && neighbor.isNatural === false);
        // const obstacles = neighbors.filter(neighbor => neighbor.isObstacle === true);

        /*console.log(nonnaturalNeighbors);
        if (obstacles.length > 0) {
            console.log(`[prune] obstacles beisde ${currNode.x},${currNode.y}:`);
            console.log(obstacles.map(obstacle => {
                return {
                    x: obstacle.x,
                    y: obstacle.y
                };
            }));
        } else {
            console.log('[prune] No obstacles');
        }*/

        if (pNode) {
            // console.log(`[prune] pNode: ${pNode.x},${pNode.y}`);
            const directionToNode = currNode.directionFrom(pNode);
            const nextNode = new Node(currNode.x + directionToNode[0], currNode.y + directionToNode[1]);
            // console.log(`[prune] next node: ${nextNode.x},${nextNode.y}`);

            nonnaturalNeighbors.forEach(nonnaturalNeighbor => {
                // const nonnaturalNeighborName = `${nonnaturalNeighbor.x},${nonnaturalNeighbor.y}`;
                if (Tools.isMovingStraight(directionToNode)) {
                    // straight move (X)
                    if (directionToNode[0] !== 0) {
                        if (nonnaturalNeighbor.x === nextNode.x) {
                            // const obstacle = obstacles.find(obstacle => obstacle.x === currNode.x && obstacle.y === nonnaturalNeighbor.y);
                            const obstacle = this._obstacleSet.has(`${currNode.x},${nonnaturalNeighbor.y}`);
                            if (obstacle) {
                                nonnaturalNeighbor.isForced = true;
                                // console.log(`[prune][straight move (X)] make ${nonnaturalNeighborName} forced`);
                                candidateNeighbors.push(nonnaturalNeighbor);
                            }
                        }
                    }
                    // straight move (Y)
                    if (directionToNode[1] !== 0) {
                        if (nonnaturalNeighbor.y === nextNode.y) {
                            // const obstacle = obstacles.find(obstacle => obstacle.x === nonnaturalNeighbor.x && obstacle.y === node.y);
                            const obstacle = this._obstacleSet.has(`${nonnaturalNeighbor.x},${currNode.y}`);
                            if (obstacle) {
                                nonnaturalNeighbor.isForced = true;
                                // console.log(`[prune][straight move (Y)] make ${nonnaturalNeighborName} forced`);
                                candidateNeighbors.push(nonnaturalNeighbor);
                            }
                        }
                    }
                } else {
                    // diagonal move
                    // const obstacle = obstacles.find(obstacle =>
                    //     (obstacle.x === pNode.x && obstacle.y === pNode.y + directionToNode[1]) ||
                    //     (obstacle.x === pNode.x + directionToNode[0] && obstacle.y === pNode.y));
                    // if (obstacle) {
                    //     const directionToObstacle = obstacle.directionFrom(pNode);
                    //     if (nonnaturalNeighbor.x === obstacle.x + directionToObstacle[0] &&
                    //         nonnaturalNeighbor.y === obstacle.y + directionToObstacle[1]) {
                    //         nonnaturalNeighbor.isForced = true;
                    //         // console.log(`[prune][diagonal move] make ${nonnaturalNeighborName} forced`);
                    //         candidateNeighbors.push(nonnaturalNeighbor);
                    //     }
                    // }

                    const prevNeighborNode = currNode.shift(-directionToNode[0], -directionToNode[1]);
                    const obstacleXNode = prevNeighborNode.shift(directionToNode[0], 0);
                    const obstacleYNode = prevNeighborNode.shift(0, directionToNode[1]);
                    if (this._obstacleSet.has(obstacleXNode.str())) {
                        const directionToObstacle = obstacleXNode.directionFrom(prevNeighborNode);
                        if (nonnaturalNeighbor.x === obstacleXNode.x + directionToObstacle[0] &&
                            nonnaturalNeighbor.y === obstacleXNode.y + directionToObstacle[1]) {
                            nonnaturalNeighbor.isForced = true;
                            // console.log(`[prune][diagonal move (X)] make ${nonnaturalNeighborName} forced`);
                            candidateNeighbors.push(nonnaturalNeighbor);
                        }
                    }
                    if (this._obstacleSet.has(obstacleYNode.str())) {
                        const directionToObstacle = obstacleYNode.directionFrom(prevNeighborNode);
                        if (nonnaturalNeighbor.x === obstacleYNode.x + directionToObstacle[0] &&
                            nonnaturalNeighbor.y === obstacleYNode.y + directionToObstacle[1]) {
                            nonnaturalNeighbor.isForced = true;
                            // console.log(`[prune][diagonal move (Y)] make ${nonnaturalNeighborName} forced`);
                            candidateNeighbors.push(nonnaturalNeighbor);
                        }
                    }
                }
            });
        }

        return candidateNeighbors;
    }

    jump(currNode: Node, direction: number[]): Node | null {
        const nextNode = new Node(currNode.x + direction[0], currNode.y + direction[1]);
        // const currNodeName = `${currNode.x},${currNode.y}`;
        // console.log(`[jump] from ${currNodeName} jump to ${nextNode.x},${nextNode.y}`);
        // const log = `${currNodeName} => ${nextNode.x},${nextNode.y}: ${direction}`;

        if (this.checkIsObstacle(nextNode)) {
            // console.log(`[jump][obstacle] ${log}`);
            return null;
        }

        if (this.checkIsOutOfBound(nextNode)) {
            // console.log(`[jump][out of bound] ${log}`);
            return null;
        }

        nextNode.prev = currNode;

        if (nextNode.equal(this._stopNode)) {
            // console.log(`[jump][goal] ${log}, return node`);
            return nextNode;
        }

        const neighbors = this.getNeighbors(nextNode);
        const hasObstacles = neighbors.findIndex(neighbor => neighbor.isObstacle === true) !== -1;
        if (hasObstacles) {
            // console.log(`[jump] there exists obstacles around ${nextNode.x},${nextNode.y}`);
            // console.log(`[jump] neighbors of ${nextNode.x},${nextNode.y}:`);
            // console.log(neighbors);

            const candidateNeighbors = this.prune(nextNode, neighbors);
            // console.log(`[jump] candidateNeighbors of ${nextNode.x},${nextNode.y}:`);
            // console.log(candidateNeighbors);
            if (candidateNeighbors.findIndex(neighbor => neighbor.isForced) !== -1) {
                // console.log(`[jump] forced neighbor of ${nextNode.x},${nextNode.y} is found, return node`);
                return nextNode;
            }
        }

        // diagonal
        if (direction[0] !== 0 && direction[1] !== 0) {
            if (this.jump(nextNode, [direction[0], 0]) !== null || this.jump(nextNode, [0, direction[1]]) !== null) {
                return nextNode;
            }
        }

        // console.log(`[jump] ${nextNode.x},${nextNode.y} jumps direction ${direction}`);
        return this.jump(nextNode, direction);
    }

    identifySuccessors(currNode: Node) {
        const neighbors = this.getNeighbors(currNode);
        const candidateNeighbors = this.prune(currNode, neighbors);
        const numCandidateNeighbors = candidateNeighbors.length;
        // console.log(`[identifySuccessors] ${currNode.x},${currNode.y} has ${numCandidateNeighbors} candidate neighbors`);
        if (numCandidateNeighbors === 0) {
            return;
        }

        for (let i = 0; i < numCandidateNeighbors; i++) {
            const neighbor = candidateNeighbors[i];
            const jumpNode = this.jump(currNode, neighbor.directionFrom(currNode));
            // console.log(`[identifySuccessors] jumpNode:`);
            // console.log(jumpNode);
            if (jumpNode) {
                if (this._visitedQ.has(jumpNode.str())) {
                    continue;
                }
                this._visitedQ.set(jumpNode.str(), jumpNode);

                const dist = currNode.stepDistanceTo(jumpNode);
                const alt = currNode.dist + dist;
                if (alt < jumpNode.dist) {
                    jumpNode.dist = alt;
                    jumpNode.f = alt + jumpNode.manhattanDistanceTo(this._stopNode);
                    jumpNode.prev = currNode;

                    this._openSet.set(jumpNode.str(), jumpNode);
                    // console.log(`[identifySuccessors] for ${neighbor.x},${neighbor.y}: add jump node ${jumpNode.x},${jumpNode.y} (dist: ${jumpNode.dist.toFixed(4)})`);
                }
            }
        }
    }

    calculatePath() {
        const calculateStartTime = this.getTime(TIME_TAG.START);

        let size = this._openSet.size;
        while (size > 0) {
            const obj = Tools.findTheMinimum(this._openSet, 'f');
            const objKey = obj.key;
            const currentNode: Node = obj.value;
            this._finalQ.set(objKey, currentNode);
            this._openSet.delete(objKey);

            if (currentNode.equal(this._stopNode)) {
                const message = "[Done] Arrival! 🚀";
                console.log(message);
                this._message = message;
                break;
            }

            this.identifySuccessors(currentNode);

            size = this._openSet.size;
            // console.log(`Size of openSet: ${size}`);
        }

        const calculateEndTime = this.getTime(TIME_TAG.END);
        const elapsedMS = calculateEndTime - calculateStartTime;
        const finalNode = this._finalQ.get(this._lastNodeKey);
        const path = Tools.createPathFromFinalQ(this._finalQ, finalNode!);

        return {
            "visited_Q": this._visitedQ,
            "final_Q": this._finalQ,
            "elapsed_ms": elapsedMS,
            "path": path,
            "message": this._message
        };
    }

    private checkIsOutOfBound(node: Node): boolean {
        if (node.x < 0 || node.y < 0 || node.x >= this._dimension.x || node.y >= this._dimension.y) {
            return true;
        }

        return false;
    }

    private checkIsObstacle(node: Node): boolean {
        return this._obstacleSet.has(node.str());
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
