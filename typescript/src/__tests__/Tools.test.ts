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
