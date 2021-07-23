import {Grid} from '../Grid';
import {Model} from '../Model';
import Tools from '../Tools';

const scenario = {
    "dimension": {"x": 10, "y": 10, "z": 10},
    "empty_data": {},
    "no_data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "waypoint": {
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": false
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
};

const scenario_2d = {
    "dimension": {"x": 15, "y": 15},
    "waypoint": {
        "start": {"x": 12, "y": 0},
        "stop": {"x": 1, "y": 11},
        "allowDiagonal": false
    },
    "data": {
        "size": 28,
        "x": [ 2,  2,  2,  2,  2,  2,  2,  2,
               3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
              12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        "y": [ 5,  6,  7,  8,  9, 10, 11, 12,
              12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
               2,  3,  4,  5,  6,  7,  8,  9, 10, 11]
    }
};

const scenario_2d_no_results = {
    "dimension": {"x": 15, "y": 15},
    "waypoint": {
        "start": {"x": 12, "y": 0},
        "stop": {"x": 1, "y": 11},
        "allowDiagonal": false
    },
    "data": {
        "size": 28,
        "x": [11, 11, 11, 12, 12, 13, 13, 13],
        "y": [-1,  0,  1, -1,  1, -1,  0,  1]
        // "x": [ 0,  1,  2,  2,
        //        2,  2,  2,  2,  2,  2,  2,  2,
        //        3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
        //       12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        // "y": [ 5,  5, 13, 14,
        //        5,  6,  7,  8,  9, 10, 11, 12,
        //       12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
        //        2,  3,  4,  5,  6,  7,  8,  9, 10, 11]
    }
};

test('test_find_the_min_F', () => {
    const obstacle2DArray = Model.createObstacleArray(scenario_2d.data);
    const model2D = new Model(scenario_2d.dimension, obstacle2DArray, scenario_2d.waypoint);
    const Q2D = model2D.createInitialQ();

    const minGrid2D = Tools.findTheMinimum(Q2D, 'f');
    expect(minGrid2D.key).toBe('12,0');
    expect(minGrid2D.value.dist).toBe(0);

    const obstacle3DArray = Model.createObstacleArray(scenario.data);
    const model3D = new Model(scenario.dimension, obstacle3DArray, scenario.waypoint);
    const isFast = true;
    const Q3D = model3D.createInitialQ(isFast);
    
    const minGrid3D = Tools.findTheMinimum(Q3D, 'f');
    expect(minGrid3D.key).toBe('5,9,2');
    expect(minGrid3D.value.dist).toBe(0);
});

test('test_create_path_from_finalQ', () => {
    const startGrid = new Grid(12, 0);
    const stopGrid = new Grid(1, 11);
    const hashmap2D = new Map<string, Grid>();

    const no_result2D = Tools.createPathFromFinalQ(hashmap2D, startGrid);
    expect(no_result2D.x[0]).toBe(startGrid.x);
    expect(no_result2D.y[0]).toBe(startGrid.y);
    expect(no_result2D.z.length).toBe(0);

    const lastGrid = new Grid(6, 6);
    startGrid.prev = lastGrid;
    hashmap2D.set(lastGrid.str(), lastGrid);
    const partial_result2D = Tools.createPathFromFinalQ(hashmap2D, lastGrid);
    expect(partial_result2D.x[0]).toBe(lastGrid.x);
    expect(partial_result2D.y[0]).toBe(lastGrid.y);

    lastGrid.prev = stopGrid;
    const great_result2D = Tools.createPathFromFinalQ(hashmap2D, stopGrid);
    expect(great_result2D.x[0]).toBe(stopGrid.x);
    expect(great_result2D.y[0]).toBe(stopGrid.y);
});
