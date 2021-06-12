import {Model} from '../Model';
import {AStar} from '../AStar';

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

test('test_find_the_min_F', () => {
    const is2d = Model.is2d(scenario.dimension);
    const obstacleArray = scenario.data ? Model.createObstacleArray(scenario.data, is2d) : [];
    const model = new Model(scenario.dimension, obstacleArray, scenario.waypoint);
    const isFast = true;
    const Q = model.createInitialQ(isFast);
    
    const { key, value } = AStar.findTheMinF(Q);
    expect(key).toBe('5,9,2');
    expect(value.dist).toBe(0);
});

test('test_calculate_path', () => {
    const aStar = new AStar(scenario);
    const result = aStar.calculatePath();
    const path = result.path;
    expect(path.x.length).toBe(14);
});
