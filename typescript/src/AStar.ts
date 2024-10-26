import { IDimension } from './interface/IDimension';
import { IObstacles } from './interface/IObstacles';
import { IWaypoints } from './interface/IWaypoints';
import { IBoundary } from './interface/IBoundary';
import { IGrouping } from './interface/IGrouping';
import { IOptions } from './interface/IOptions';
import { Node } from './Node';
import { Model } from './Model';
import Tools from './Tools';

enum TIME_TAG {
  START,
  END
};

export class AStar {
  readonly _dimension: IDimension;
  readonly _is2d: boolean;
  readonly _obstacleArray: Array<Node>;
  readonly _startNode: Node;
  readonly _stopNode: Node;
  readonly _allowDiagonal: boolean;
  readonly _openSet: Map<string, Node>;
  readonly _Q: Map<string, Node>;
  readonly _zCeil: number;
  readonly _zFloor: number;

  readonly _isGrouping: boolean;
  readonly _groupRadius: number;
  readonly _isGroupFlat: boolean;

  readonly _debugMode: boolean;
  readonly _isFast: boolean;

  private _lastNodeKey: string;
  private _message: string = "[Done] no results.";
  private _numObstaclesInStartGroup: number = 0;
  private _numObstaclesInStopGroup: number = 0;

  constructor(scenario: { dimension: IDimension, waypoint: IWaypoints, data?: IObstacles, boundary?: IBoundary, grouping?: IGrouping }, options?: IOptions) {
    this._dimension = scenario.dimension;
    this._is2d = Model.is2d(this._dimension);
    this._obstacleArray = Model.createObstacleArray(scenario.data);

    const waypoint = scenario.waypoint;
    // console.log(waypoint);

    if (!options) {
      this._debugMode = false;
      this._isFast = true;
    } else {
      this._debugMode = options.debugMode ? options.debugMode : false;
      this._isFast = options.type ? options.type === 'original' ? false : true : true;
    }

    const model = new Model(this._dimension, this._obstacleArray, waypoint, this._debugMode);
    this._Q = model.createInitialQ(this._isFast);

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

    const grouping = scenario.grouping;
    this._isGrouping = grouping ? Number(grouping.radius) ? true : false : false;
    // console.log(isGrouping);
    this._groupRadius = this._isGrouping ? Number(grouping!.radius) : 0;
    this._isGroupFlat = (this._is2d || boundary !== undefined);

    if (this._isGrouping) {
      const groupingStyle = this._isGroupFlat ? 'circle' : 'sphere';
      console.log(`[Grouping] radius ${this._groupRadius + 0.6} of ${groupingStyle}`);

      this._numObstaclesInStartGroup = 0;
      this._numObstaclesInStopGroup = 0;
      if (this._obstacleArray.findIndex(obstacle => {
        return Tools.intersect(this._startNode, obstacle, this._groupRadius, this._isGroupFlat);
      }) !== -1) {
        // const message = `[Grouping Error] obstacle is in the start ${groupingStyle}`;
        // console.log(message);
        this._numObstaclesInStartGroup += 1;
      }
      if (this._obstacleArray.findIndex(obstacle => {
        return Tools.intersect(this._stopNode, obstacle, this._groupRadius, this._isGroupFlat);
      }) !== -1) {
        // const message = `[Grouping Error] obstacle is in the stop ${groupingStyle}`;
        // console.log(message);
        this._numObstaclesInStopGroup += 1;
      }

      if (this._numObstaclesInStartGroup > 0) {
        this._numObstaclesInStartGroup === 1 ?
          console.log(`[Grouping Error] ${this._numObstaclesInStartGroup} obstacle is in the start ${groupingStyle}`) :
          console.log(`[Grouping Error] ${this._numObstaclesInStartGroup} obstacles are in the start ${groupingStyle}`);
      }
      if (this._numObstaclesInStopGroup > 0) {
        this._numObstaclesInStopGroup === 1 ?
          console.log(`[Grouping Error] ${this._numObstaclesInStopGroup} obstacle is in the stop ${groupingStyle}`) :
          console.log(`[Grouping Error] ${this._numObstaclesInStopGroup} obstacles are in the stop ${groupingStyle}`);
      }
    }
  }

  calculatePath(): any {
    const finalQ = new Map<string, Node>();
    const visitedQ = new Map<string, Node>();

    const calculateStartTime = this.getTime(TIME_TAG.START);

    if (this._numObstaclesInStopGroup > 0) {
      const calculateEndTime = this.getTime(TIME_TAG.END);
      const elapsedMS = calculateEndTime - calculateStartTime;
      const path = {
        x: [Number(this._startNode.x)],
        y: [Number(this._startNode.y)],
        z: this._is2d ? [] : [Number(this._startNode.z)]
      };
      const refinedPath = Tools.refinePathFromCollinearity(path);
      this._message = "[Path Error] no results due to obstacles in STOP area.";

      return {
        "visited_Q": visitedQ,
        "final_Q": finalQ,
        "elapsed_ms": elapsedMS,
        "path": path,
        "refined_path": refinedPath,
        "message": this._message
      };
    }

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
              if (neighborNode.isOutOfBound({
                boundX: [-1, this._dimension.x],
                boundY: [-1, this._dimension.y]
              })) {
                continue;
              }

              if (this._isGrouping) {
                if (this._obstacleArray.find(obstacle => Tools.intersect(neighborNode, obstacle, this._groupRadius))) {
                  continue;
                }
              } else {
                if (this._obstacleArray.find(obstacle => obstacle.equal(neighborNode))) {
                  // Find out an obstacle on the point
                  continue;
                }
              }

              const neighborNodeStr = neighborNode.str();
              if (finalQ.has(neighborNodeStr)) {
                continue;
              }

              if (this._isFast) {
                let neighborObj = visitedQ.get(neighborNodeStr);
                if (!neighborObj) {
                  neighborObj = new Node(neighborNode.x, neighborNode.y);
                  visitedQ.set(neighborNodeStr, neighborObj);
                }

                if (!this._openSet.has(neighborNodeStr)) {
                  this._openSet.set(neighborNodeStr, neighborObj);
                }

                const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol);
                const alt = currentNode.dist + dist;
                if (alt < neighborObj.dist) {
                  neighborObj.dist = alt;
                  neighborObj.f = alt + neighborObj.manhattanDistanceTo(this._stopNode);
                  neighborObj.prev = currentNode;
                  this._openSet.set(neighborNodeStr, neighborObj);
                }
              } else {
                const neighbor = this._Q.get(neighborNodeStr) as Node;
                visitedQ.set(neighborNodeStr, neighbor);

                if (!this._openSet.has(neighborNodeStr)) {
                  this._openSet.set(neighborNodeStr, neighbor);
                }

                const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol);
                const alt = currentNode.dist + dist;
                if (alt < neighbor.dist) {
                  neighbor.dist = alt;
                  neighbor.f = alt + neighbor.manhattanDistanceTo(this._stopNode);
                  neighbor.prev = currentNode;
                  this._openSet.set(neighborNodeStr, neighbor);
                }
              }
            }
          } else {
            for (let shiftZ = -1; shiftZ <= 1; shiftZ++) {
              // Note: Here diagonally z-shift is not considered
              const isNotDiagonal = (shiftRow === 0 || shiftCol === 0) && (shiftRow != shiftCol) || (shiftRow === 0 && shiftCol === 0);
              const isDiagonal = !(shiftRow === 0 && shiftCol === 0 && shiftZ === 0);

              const isAllowed = this._allowDiagonal ? isDiagonal : isNotDiagonal;
              // If _isGrouping, then isNotDiagonal
              // const isAllowed = this._isGrouping ? isNotDiagonal : this._allowDiagonal ? isDiagonal : isNotDiagonal;
              if (isAllowed) {
                const neighborNode = currentNode.shift(shiftRow, shiftCol, shiftZ);

                if (neighborNode.isOutOfBound({ boundZ: [this._zFloor, this._zCeil] })) {
                  continue;
                }

                // Full search (time-consuming) = 2D

                // Fast search
                if (this._isGrouping) {
                  if (this._obstacleArray.find(obstacle => Tools.intersect(neighborNode, obstacle, this._groupRadius, this._isGroupFlat))) {
                    continue;
                  }
                } else {
                  if (this._obstacleArray.find(obstacle => obstacle.equal(neighborNode))) {
                    // Find out an obstacle on the point
                    continue;
                  }
                }

                const neighborNodeStr = neighborNode.str();
                if (finalQ.has(neighborNodeStr)) {
                  continue;
                }

                let neighborObj = visitedQ.get(neighborNodeStr);
                if (!neighborObj) {
                  neighborObj = new Node(neighborNode.x, neighborNode.y, neighborNode.z);
                  visitedQ.set(neighborNodeStr, neighborObj);
                }

                if (!this._openSet.has(neighborNodeStr)) {
                  this._openSet.set(neighborNodeStr, neighborObj);
                }

                const dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol + shiftZ * shiftZ);
                const alt = currentNode.dist + dist;
                if (alt < neighborObj.dist) {
                  neighborObj.dist = alt;
                  neighborObj.f = alt + neighborObj.manhattanDistanceTo(this._stopNode);
                  neighborObj.prev = currentNode;
                  this._openSet.set(neighborNodeStr, neighborObj);
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
    if (this._numObstaclesInStartGroup > 0 && path.x.length === 1) {
      this._message = "[Path Error] no results due to obstacles in START area.";
    }

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
