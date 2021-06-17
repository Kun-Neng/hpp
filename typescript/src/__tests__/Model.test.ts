import {Grid} from '../Grid';
import {Model} from '../Model';

test('test_is_2d', () => {
    const dimension = {"x": 10, "y": 10, "z": 10};
    expect(Model.is2d(dimension)).toBe(false);
});

test('test_check_num_obstacles', () => {
    const scenario_2d_data = {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        // "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    };
    const obstacle2dArray = Model.createObstacleArray(scenario_2d_data, true);
    const num2dObstacles = obstacle2dArray.length;
    expect(num2dObstacles).toBe(scenario_2d_data.size);
    
    const scenario_3d_data = {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    };
    const obstacle3dArray = Model.createObstacleArray(scenario_3d_data, false);
    const num3dObstacles = obstacle3dArray.length;
    expect(num3dObstacles).toBe(scenario_3d_data.size);
});

test('test_grids_on_obstacles', () => {
    const is2d = false;
    const scenario_3d_data = {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    };
    const obstacle3dArray = Model.createObstacleArray(scenario_3d_data, is2d);

    const testWaypointArray1 = [
        new Grid(5, 9, 2),
        new Grid(5, 0, 4)
    ];
    expect(Model.gridsOnObstacles(obstacle3dArray, testWaypointArray1)).toBe(false);

    const testWaypointArray2 = [
        new Grid(5, 9, 2),
        new Grid(6, 6, 5)
    ];
    expect(Model.gridsOnObstacles(obstacle3dArray, testWaypointArray2)).toBe(true);
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

test('test_create_initial_Q', () => {
    const scenario_3d = {
        "dimension": { "x": 10, "y": 10, "z": 10 },
        "waypoint": {
            "start": {"x": 5, "y": 9, "z": 2},
            "stop": {"x": 6, "y": 6, "z": 5},
            "allowDiagonal": false
        },
        "data": {
            "size": 16,
            "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
            "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
        }
    };

    const obstacleArray = scenario_3d.data ? Model.createObstacleArray(scenario_3d.data, false) : [];
    const model = new Model(scenario_3d.dimension, obstacleArray, scenario_3d.waypoint);
    const isFast = false
    const Q = model.createInitialQ(isFast);
    
    const size = Q.size;
    const numberObstacleGrids = (scenario_3d.dimension.x * scenario_3d.dimension.y * scenario_3d.dimension.z) - scenario_3d.data.size;
    expect(size).toBe(numberObstacleGrids);
});
