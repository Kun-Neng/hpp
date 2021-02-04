"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var Grid_1 = require("./Grid");
var Model = /** @class */ (function () {
    function Model(dimension, obstacleArray, waypoint) {
        this._dimension = dimension;
        this._is2d = Model.is2d(this._dimension);
        this._obstacleArray = obstacleArray;
        var start = waypoint.start;
        var stop = waypoint.stop;
        this._startGrid = new Grid_1.Grid(start.x, start.y, start.z, this._is2d);
        this._stopGrid = new Grid_1.Grid(stop.x, stop.y, stop.z, this._is2d);
        this._distX = this._stopGrid.x - this._startGrid.x;
        this._distY = this._stopGrid.y - this._startGrid.y;
        this._distZ = this._stopGrid.z - this._startGrid.z;
        this._initQ = new Map();
    }
    Model.is2d = function (dimension) {
        if (!dimension.hasOwnProperty("z")) {
            return true;
        }
        if (dimension["z"] <= 0) {
            return true;
        }
        return false;
    };
    Model.createObstacleArray = function (data, is2d) {
        var obstacleArray = new Array();
        if (Object.keys(data).length === 0 || data.size === 0) {
            return obstacleArray;
        }
        var size = data.size;
        var xArray = data.x;
        var yArray = data.y;
        if (is2d) {
            for (var i = 0; i < size; i++) {
                obstacleArray.push(new Grid_1.Grid(xArray[i], yArray[i]));
            }
        }
        else {
            var zArray = data.z;
            for (var i = 0; i < size; i++) {
                obstacleArray.push(new Grid_1.Grid(xArray[i], yArray[i], zArray[i], is2d));
            }
        }
        return obstacleArray;
    };
    Model.gridsOnObstacles = function (array, grids) {
        array.forEach(function (obstacle) {
            grids.forEach(function (grid) {
                if (grid.equal(obstacle)) {
                    console.log("the point is located on restricted region");
                    return true;
                }
            });
        });
        return false;
    };
    Model.isBoundaryAvailable = function (lowerBound, value, upperBound) {
        if (value <= lowerBound) {
            console.log("value <= lower_bound");
            return false;
        }
        if (value >= upperBound) {
            console.log("value >= upper_bound");
            return false;
        }
        return (lowerBound + 1 < upperBound);
    };
    Model.prototype.updateInitQ = function (row, col, z, obstacle) {
        var cellGrid = new Grid_1.Grid(row, col, z, this._is2d);
        if (cellGrid.equal(obstacle)) {
            return;
        }
        var cellObj = {
            row: row,
            col: col,
            z: z,
            prev: undefined,
            dist: Number.MAX_SAFE_INTEGER,
            f: Number.MAX_SAFE_INTEGER
        };
        if (cellGrid.equal(this._startGrid)) {
            cellObj.dist = 0;
            cellObj.f = this._is2d ? cellObj.dist + Math.abs(this._distX) + Math.abs(this._distY) : cellObj.dist + Math.abs(this._distX) + Math.abs(this._distY) + Math.abs(this._distZ);
        }
        this._initQ.set(cellGrid.str(), cellObj);
    };
    Model.prototype.createInitialQ = function (isFast) {
        var _this = this;
        var x = Number(this._dimension.x);
        var y = Number(this._dimension.y);
        if (this._is2d) {
            var _loop_1 = function (row) {
                var _loop_3 = function (col) {
                    this_1._obstacleArray.forEach(function (obstacle) {
                        _this.updateInitQ(row, col, 0, obstacle);
                    });
                };
                for (var col = 0; col < y; col++) {
                    _loop_3(col);
                }
            };
            var this_1 = this;
            for (var row = 0; row < x; row++) {
                _loop_1(row);
            }
        }
        else {
            var z = Number(this._dimension.z);
            if (isFast) {
                var fValue = Math.sqrt(this._distX * this._distX + this._distY * this._distY + this._distZ * this._distZ);
                this._initQ.set(this._startGrid.str(), {
                    row: this._startGrid.x,
                    col: this._startGrid.y,
                    z: this._startGrid.z,
                    prev: undefined,
                    dist: 0,
                    f: fValue
                });
            }
            else {
                var _loop_2 = function (row) {
                    var _loop_4 = function (col) {
                        var _loop_5 = function (iz) {
                            this_2._obstacleArray.forEach(function (obstacle) {
                                _this.updateInitQ(row, col, iz, obstacle);
                            });
                        };
                        for (var iz = 0; iz < z; iz++) {
                            _loop_5(iz);
                        }
                    };
                    for (var col = 0; col < y; col++) {
                        _loop_4(col);
                    }
                };
                var this_2 = this;
                for (var row = 0; row < x; row++) {
                    _loop_2(row);
                }
            }
        }
        return this._initQ;
    };
    return Model;
}());
exports.Model = Model;
