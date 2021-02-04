"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AStar_1 = require("./AStar");
var scenario_2d = {
    "dimension": { "x": 15, "y": 15, "z": 0 },
    // "data": {},
    // "data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "waypoint": {
        "start": { "x": 12, "y": 0, "z": 0 },
        "stop": { "x": 1, "y": 11, "z": 0 },
        "allowDiagonal": false
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
};
var scenario_3d = {
    "dimension": { "x": 10, "y": 10, "z": 10 },
    // "data": {},
    // "data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "waypoint": {
        "start": { "x": 5, "y": 9, "z": 2 },
        "stop": { "x": 5, "y": 0, "z": 4 },
        "allowDiagonal": true
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
};
// const grid1 = new Grid(1, 2, 3, false);
// console.log(grid1.str());
// const grid2 = new Grid(1, 2, 4, false);
// console.log(grid1.equal(grid2));
var aStar = new AStar_1.AStar(scenario_3d);
var result = aStar.calculatePath();
var elapsedMS = result.elapsedMS;
console.log(elapsedMS);
var path = result.path;
console.log("x:", path.x);
console.log("y:", path.y);
console.log("z:", path.z);
