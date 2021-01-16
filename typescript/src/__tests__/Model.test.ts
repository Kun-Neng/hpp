import {Model} from '../Model';

test('test_is_2d', () => {
    const scenario = {
        "dimension": {"x": 10, "y": 10, "z": 10}
    };
    const dimension = scenario.dimension;
    const is2d = Model.is2d(dimension);
    expect(is2d).toBe(false);
});

test('test_check_num_obstacles', () => {
    const scenario = {
        "data": {
            "size": 16,
            "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
            "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
        }
    };
    const is2d = false;
    const obstacleArray = Model.createObstacleArray(scenario.data, is2d);
    const numObstacles = obstacleArray.length;
    expect(numObstacles).toBe(scenario.data.size);
});

test('test_boundary', () => {
    const scenario = {
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
    const zStart = Number(scenario.waypoint.start.z);
    const zCeil = Number(scenario.boundary.zCeil);
    const zFloor = Number(scenario.boundary.zFloor);
    expect(Model.isBoundaryAvailable(zFloor, zStart, zCeil)).toBe(true);
});
