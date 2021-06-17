import {Grid} from '../Grid';

test('test_is2d', () => {
    const grid2D = new Grid(1, 2);
    expect(grid2D.is2d).toBe(true);

    const grid3D1 = new Grid(1, 2, 0);
    expect(grid3D1.is2d).toBe(false);

    const grid3D2 = new Grid(1, 2, 3);
    expect(grid3D2.is2d).toBe(false);
});

test('test_str', () => {
    const grid2D = new Grid(1, 2);
    expect(grid2D.str()).toBe('1,2');

    const grid3D1 = new Grid(1, 2, 0);
    expect(grid3D1.str()).toBe('1,2,0');

    const grid3D2 = new Grid(1, 2, 3);
    expect(grid3D2.str()).toBe('1,2,3');
});

test('test_equal', () => {
    const grid2D = new Grid(1, 2);
    expect(grid2D.equal(new Grid(1, 2))).toBe(true);
    expect(grid2D.equal(new Grid(1, 2, 0))).toBe(false);

    const grid3D1 = new Grid(1, 2, 0);
    expect(grid3D1.equal(new Grid(1, 2, 0))).toBe(true);
    expect(grid3D1.equal(new Grid(1, 2))).toBe(false);

    const grid3D2 = new Grid(1, 2, 3);
    expect(grid3D2.equal(new Grid(1, 2, 3))).toBe(true);
    expect(grid3D2.equal(new Grid(1, 2, 4))).toBe(false);
});

test('test_shift', () => {
    const grid2D = new Grid(1, 2);
    expect(grid2D.shift(2, 1).equal(new Grid(3, 3))).toBe(true);
    expect(grid2D.shift(2, 1, 1).equal(new Grid(3, 3))).toBe(true);

    const grid3D1 = new Grid(1, 2, 0);
    expect(grid3D1.shift(2, 1).equal(new Grid(3, 3, 0))).toBe(true);
    expect(grid3D1.shift(2, 1, 3).equal(new Grid(3, 3, 3))).toBe(true);
});

test('test_is_out_of_bound', () => {
    const grid2D = new Grid(1, 2);
    expect(grid2D.isOutOfBound({boundZ: [-10, -5]})).toBe(false);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1]})).toBe(false);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1], boundY: [-1, 1]})).toBe(true);

    const grid3D1 = new Grid(1, 2, 0);
    expect(grid3D1.isOutOfBound({boundZ: [-10, -5]})).toBe(true);
    expect(grid3D1.isOutOfBound({boundZ: [-1, 1]})).toBe(false);
});

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
    const startGrid = new Grid(start.x, start.y, start.z);

    const data = scenario.data;
    const indexObstacle = 0;
    const obstacleGrid = new Grid(data.x[indexObstacle], data.y[indexObstacle], data.z[indexObstacle]);
    const testGrid = new Grid(5, 9, 2);

    // expect(startGrid.str()).toBe(obstacleGrid.str());
    expect(startGrid.str()).toBe(testGrid.str());
});
