import {Grid} from '../Grid';

const grid2D = new Grid(1, 2);
const grid3D120 = new Grid(1, 2, 0);
const grid3D123 = new Grid(1, 2, 3);

test('test_is2d', () => {
    expect(grid2D.is2d).toBe(true);
    expect(grid3D120.is2d).toBe(false);
    expect(grid3D123.is2d).toBe(false);
});

test('test_str', () => {
    expect(grid2D.str()).toBe('1,2');
    expect(grid3D120.str()).toBe('1,2,0');
    expect(grid3D123.str()).toBe('1,2,3');
});

test('test_equal', () => {
    expect(grid2D.equal(new Grid(1, 2))).toBe(true);
    expect(grid2D.equal(new Grid(1, 2, 0))).toBe(false);

    expect(grid3D120.equal(new Grid(1, 2, 0))).toBe(true);
    expect(grid3D120.equal(new Grid(1, 2))).toBe(false);

    expect(grid3D123.equal(new Grid(1, 2, 3))).toBe(true);
    expect(grid3D123.equal(new Grid(1, 2, 4))).toBe(false);
});

test('test_shift', () => {
    expect(grid2D.shift(2, 1).equal(new Grid(3, 3))).toBe(true);
    expect(grid2D.shift(2, 1, 1).equal(new Grid(3, 3))).toBe(true);

    expect(grid3D120.shift(2, 1).equal(new Grid(3, 3, 0))).toBe(true);
    expect(grid3D120.shift(2, 1, 3).equal(new Grid(3, 3, 3))).toBe(true);
});

test('test_is_out_of_bound', () => {
    expect(grid2D.isOutOfBound({})).toBe(false);
    expect(grid2D.isOutOfBound({boundZ: [-10, -5]})).toBe(false);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1]})).toBe(false);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1], boundX: [-1, 1]})).toBe(true);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2]})).toBe(false);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1], boundY: [-2, 2]})).toBe(true);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1], boundY: [-3, 3]})).toBe(false);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1], boundX: [-1, 1], boundY: [-2, 2]})).toBe(true);
    expect(grid2D.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2], boundY: [-3, 3]})).toBe(false);

    expect(grid3D120.isOutOfBound({boundZ: [-10, -5]})).toBe(true);
    expect(grid3D120.isOutOfBound({boundZ: [-1, 1]})).toBe(false);
    expect(grid3D120.isOutOfBound({boundZ: [-1, 1], boundX: [-1, 1]})).toBe(true);
    expect(grid3D120.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2]})).toBe(false);
    expect(grid3D120.isOutOfBound({boundZ: [-1, 1], boundY: [-2, 2]})).toBe(true);
    expect(grid3D120.isOutOfBound({boundZ: [-1, 1], boundY: [-3, 3]})).toBe(false);
    expect(grid3D120.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2], boundY: [-2, 2]})).toBe(true);
    expect(grid3D120.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2], boundY: [-3, 3]})).toBe(false);
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
