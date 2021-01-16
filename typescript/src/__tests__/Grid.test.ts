import {Grid} from '../Grid';

test('test_object_collision', () => {
    const scenario = {
        "waypoint": {
            "start": {"x": 5, "y": 9, "z": 2},
            "stop": {"x": 5, "y": 0, "z": 4},
            "allowDiagonal": false
        },
        "data": {
            "size": 16,
            "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
            "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
        }
    };
    const start = scenario.waypoint.start;
    const startGrid = new Grid(start.x, start.y, start.z, false);

    const data = scenario.data;
    const indexObstacle = 0;
    const obstacleGrid = new Grid(data.x[indexObstacle], data.y[indexObstacle], data.z[indexObstacle], false);
    const testGrid = new Grid(5, 9, 2, false);

    // expect(startGrid.str()).toBe(obstacleGrid.str());
    expect(startGrid.str()).toBe(testGrid.str());
});
