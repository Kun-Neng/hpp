"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AStar = void 0;
var Grid_1 = require("./Grid");
var Model_1 = require("./Model");
var TIME_TAG;
(function (TIME_TAG) {
    TIME_TAG[TIME_TAG["START"] = 0] = "START";
    TIME_TAG[TIME_TAG["END"] = 1] = "END";
})(TIME_TAG || (TIME_TAG = {}));
;
var AStar = /** @class */ (function () {
    function AStar(scenario) {
        var dimension = scenario.dimension;
        this._is2d = Model_1.Model.is2d(dimension);
        if (scenario.hasOwnProperty("data")) {
            this._obstacleArray = Model_1.Model.createObstacleArray(scenario.data, this._is2d);
        }
        else {
            this._obstacleArray = [];
        }
        this._numObstacles = this._obstacleArray.length;
        var waypoint = scenario.hasOwnProperty("waypoint") ? scenario.waypoint : {};
        // console.log(waypoint);
        // console.log(Object.keys(waypoint).length);
        if (Object.keys(waypoint).length < 2 || !waypoint.hasOwnProperty("start") || !waypoint.hasOwnProperty("stop")) {
            throw new Error('Invalid waypoint!');
        }
        var start = waypoint.start;
        var stop = waypoint.stop;
        this._startGrid = new Grid_1.Grid(start.x, start.y, start.z, this._is2d);
        this._stopGrid = new Grid_1.Grid(stop.x, stop.y, stop.z, this._is2d);
        this._allowDiagonal = waypoint.hasOwnProperty("allowDiagonal") ? Boolean(waypoint.allowDiagonal) : false;
        var model = new Model_1.Model(dimension, this._obstacleArray, waypoint);
        var isFast = true;
        this._Q = model.createInitialQ(isFast);
        this._openSet = new Map();
        this._openSet.set(this._startGrid.str(), this._Q.get(this._startGrid.str()));
        if (Model_1.Model.gridsOnObstacles(this._obstacleArray, [this._startGrid, this._stopGrid])) {
            console.log("Waypoint Error");
        }
        var boundary = scenario.hasOwnProperty("boundary") ? scenario.boundary : {};
        if (!this._is2d) {
            this._zCeil = (boundary && boundary.hasOwnProperty("zCeil")) ? Number(boundary.zCeil) : Number.MAX_SAFE_INTEGER;
            this._zFloor = (boundary && boundary.hasOwnProperty("zFloor")) ? Number(boundary.zFloor) : Number.MIN_SAFE_INTEGER;
            if (!Model_1.Model.isBoundaryAvailable(this._zFloor, this._startGrid.z, this._zCeil)) {
                console.log("Boundary Error");
            }
        }
        else {
            this._zCeil = Number.MAX_SAFE_INTEGER;
            this._zFloor = Number.MIN_SAFE_INTEGER;
        }
    }
    AStar.findTheMinF = function (hashmap) {
        var objKey = undefined;
        var objValue = undefined;
        var minF = Number.MAX_SAFE_INTEGER;
        hashmap.forEach(function (obj, key) {
            // console.log(key + ':' + obj.f);
            if (obj.f < minF) {
                objKey = key;
                objValue = obj;
                minF = obj.f;
            }
        });
        return {
            "key": objKey,
            "value": objValue
        };
    };
    AStar.prototype.createPathFromFinalQ = function (finalQ) {
        var finalObject = finalQ.get(this._stopGrid.str());
        var newXArray = [Number(finalObject.row)];
        var newYArray = [Number(finalObject.col)];
        var newZArray = this._is2d ? [0] : [Number(finalObject.z)];
        while (finalObject.prev) {
            finalObject = finalQ.get(finalObject.prev);
            var currentRow = Number(finalObject.row);
            var currentCol = Number(finalObject.col);
            var currentZ = this._is2d ? 0 : Number(finalObject.z);
            newXArray.push(currentRow);
            newYArray.push(currentCol);
            newZArray.push(currentZ);
        }
        return {
            x: newXArray.reverse(),
            y: newYArray.reverse(),
            z: newZArray.reverse()
        };
    };
    AStar.prototype.calculatePath = function () {
        var finalQ = new Map();
        var visitedQ = new Map();
        var calculateStartTime = this.getTime(TIME_TAG.START);
        var size = this._openSet.size;
        while (size > 0) {
            var obj = AStar.findTheMinF(this._openSet);
            var objKey = obj.key;
            var currentObj = obj.value;
            finalQ.set(objKey, currentObj);
            this._openSet.delete(objKey);
            var currentGrid = void 0;
            if (this._is2d) {
                currentGrid = new Grid_1.Grid(currentObj.row, currentObj.col);
            }
            else {
                currentGrid = new Grid_1.Grid(currentObj.row, currentObj.col, currentObj.z, this._is2d);
            }
            if (currentGrid.equal(this._stopGrid)) {
                console.log("Arrival!");
                break;
            }
            for (var shiftRow = -1; shiftRow <= 1; shiftRow++) {
                for (var shiftCol = -1; shiftCol <= 1; shiftCol++) {
                    if (this._is2d) {
                        var isNotDiagonal = (shiftRow === 0 || shiftCol === 0) && (shiftRow != shiftCol);
                        var isDiagonal = !(shiftRow === 0 && shiftCol === 0);
                        var isAllowed = this._allowDiagonal ? isDiagonal : isNotDiagonal;
                        if (isAllowed) {
                            var neighborGrid = currentGrid.shift(shiftRow, shiftCol);
                            var neighbor = this._Q.get(neighborGrid.str());
                            if (neighbor && !finalQ.get(neighborGrid.str())) {
                                visitedQ.set(neighborGrid.str(), neighbor);
                                if (this._openSet.get(neighborGrid.str())) {
                                    this._openSet.set(neighborGrid.str(), neighbor);
                                }
                                var dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol);
                                var alt = currentObj.dist + dist;
                                if (alt < neighbor.dist) {
                                    neighbor.dist = alt;
                                    var distX = this._stopGrid.x - neighbor.row;
                                    var distY = this._stopGrid.y - neighbor.col;
                                    neighbor.f = alt + Math.abs(distX) + Math.abs(distY);
                                    // neighbor.f = alt + Math.sqrt(distX * distX + distY * distY);
                                    neighbor.prev = currentGrid.str();
                                    this._openSet.set(neighborGrid.str(), neighbor);
                                }
                            }
                        }
                    }
                    else {
                        var _loop_1 = function (shiftZ) {
                            var isNotDiagonal = (shiftRow === 0 || shiftCol === 0) && (shiftRow != shiftCol) || (shiftRow === 0 && shiftCol === 0);
                            var isDiagonal = !(shiftRow === 0 && shiftCol === 0 && shiftZ === 0);
                            var isAllowed = this_1._allowDiagonal ? isDiagonal : isNotDiagonal;
                            if (isAllowed) {
                                var neighborGrid_1 = currentGrid.shift(shiftRow, shiftCol, shiftZ);
                                if (neighborGrid_1.isOutOfBound({ boundZ: [this_1._zFloor, this_1._zCeil] })) {
                                    return "continue";
                                }
                                // Full search (time-consuming) = 2D
                                // Fast search
                                if (this_1._obstacleArray.findIndex(function (obstacle) {
                                    return obstacle.equal(neighborGrid_1);
                                }) !== -1) {
                                    return "continue";
                                }
                                if (!finalQ.has(neighborGrid_1.str())) {
                                    var neighborObj = visitedQ.get(neighborGrid_1.str());
                                    if (!neighborObj) {
                                        neighborObj = {
                                            row: neighborGrid_1.x,
                                            col: neighborGrid_1.y,
                                            z: neighborGrid_1.z,
                                            prev: undefined,
                                            dist: Number.MAX_SAFE_INTEGER,
                                            f: Number.MAX_SAFE_INTEGER
                                        };
                                        visitedQ.set(neighborGrid_1.str(), neighborObj);
                                    }
                                    var dist = Math.sqrt(shiftRow * shiftRow + shiftCol * shiftCol + shiftZ * shiftZ);
                                    var alt = currentObj.dist + dist;
                                    if (!this_1._openSet.has(neighborGrid_1.str())) {
                                        this_1._openSet.set(neighborGrid_1.str(), neighborObj);
                                    }
                                    if (alt < neighborObj.dist) {
                                        neighborObj.dist = alt;
                                        // neighborObj.f = alt + Math.abs(this._stopGrid.x - neighborObj.row) + Math.abs(this._stopGrid.y - neighborObj.col) + Math.abs(this._stopGrid.z - neighborObj.z);
                                        var leftX = this_1._stopGrid.x - neighborObj.row;
                                        var leftY = this_1._stopGrid.y - neighborObj.col;
                                        var leftZ = this_1._stopGrid.z - neighborObj.z;
                                        neighborObj.f = alt + Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
                                        neighborObj.prev = currentGrid.str();
                                        this_1._openSet.set(neighborGrid_1.str(), neighborObj);
                                    }
                                }
                            }
                        };
                        var this_1 = this;
                        for (var shiftZ = -1; shiftZ <= 1; shiftZ++) {
                            _loop_1(shiftZ);
                        }
                    }
                }
            }
            size = this._openSet.size;
        }
        var calculateEndTime = this.getTime(TIME_TAG.END);
        var elapsedTimeString = this.elapsedTimeString(calculateStartTime, calculateEndTime);
        return {
            "visitedQ": visitedQ,
            "finalQ": finalQ,
            "elapsedMS": elapsedTimeString,
            "path": this.createPathFromFinalQ(finalQ)
        };
    };
    AStar.prototype.getTimeString = function (ms) {
        return new Date(ms).toTimeString();
    };
    ;
    AStar.prototype.elapsedTimeString = function (startTime, endTime) {
        var duration = endTime - startTime;
        if (duration >= 60 * 1000) {
            return duration / (60 * 1000) + " minutes";
        }
        else if (duration >= 1000) {
            return duration / 1000 + " seconds";
        }
        else {
            return duration + " milliseconds";
        }
    };
    ;
    AStar.prototype.getTime = function (tag) {
        var now = Date.now();
        console.log("[" + this.getTimeString(now) + "] path finding algorithm " + TIME_TAG[tag] + ".");
        return now;
    };
    return AStar;
}());
exports.AStar = AStar;
