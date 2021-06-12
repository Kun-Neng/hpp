import {AStar} from './AStar';

const scenario = {
    "dimension": {"x": 15, "y": 15, "z": 0},
    "waypoint": {
        "start": {"x": 12, "y": 0, "z": 0},
        "stop": {"x": 1, "y": 11, "z": 0},
        "allowDiagonal": true
    },
    "data": {
        "size": 28,
        "x": [
            2, 2, 2, 2, 2, 2, 2, 2,
            3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            12, 12, 12, 12, 12, 12, 12, 12, 12, 12
        ],
        "y": [
            5, 6, 7, 8, 9, 10, 11, 12,
            12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
            2, 3, 4, 5, 6, 7, 8, 9, 10, 11
        ],
        "z": [
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]
    }
};

const scenario_2d = {
    "dimension": {"x": 15, "y": 15, "z": 0},
    "waypoint": {
        "start": {"x": 12, "y": 0, "z": 0},
        "stop": {"x": 1, "y": 11, "z": 0},
        "allowDiagonal": false
    },
    // "data": {},
    // "data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
};

const scenario_3d = {
    "dimension": { "x": 10, "y": 10, "z": 10 },
    "waypoint": {
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": false
    },
    // "data": {},
    // "data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
};

// import * as scenario_file from './__tests__/test_no_results_yet.json';

// const grid1 = new Grid(1, 2, 3, false);
// console.log(grid1.str());
// const grid2 = new Grid(1, 2, 4, false);
// console.log(grid1.equal(grid2));

const aStar = new AStar(scenario_3d);
const result = aStar.calculatePath();
const elapsedMS = result.elapsedMS;
console.log(`message: ${result.message}`);
console.log(`elapsed_ms: ${elapsedMS} ms`);

const path = result.path;
console.log("x:", path.x);
console.log("y:", path.y);
console.log("z:", path.z);
