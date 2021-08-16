import {Node} from '../Node';

const node2D = new Node(1, 2);
const node3D120 = new Node(1, 2, 0);
const node3D123 = new Node(1, 2, 3);
const node3D212 = new Node(2, 1, 2);

test('test_is2d', () => {
    expect(node2D.is2d).toBe(true);
    expect(node3D120.is2d).toBe(false);
    expect(node3D123.is2d).toBe(false);
});

test('test_for_JPS', () => {
    expect(node2D.isObstacle).toBe(false);
    node2D.isObstacle = true;
    expect(node2D.isObstacle).toBe(true);

    expect(node2D.isNatural).toBe(false);
    node2D.isNatural = true;
    expect(node2D.isNatural).toBe(true);

    expect(node2D.isForced).toBe(false);
    node2D.isForced = true;
    expect(node2D.isForced).toBe(true);
});

test('test_get_crux', () => {
    expect(node2D.getCrux('dist')).toBe(Number.MAX_SAFE_INTEGER);
    expect(node2D.getCrux('f')).toBe(Number.MAX_SAFE_INTEGER);
    expect(node2D.getCrux('')).toBe(Number.MAX_SAFE_INTEGER);

    node2D.dist = 1;
    node2D.f = 0.5;
    expect(node2D.getCrux('dist')).toBe(node2D.dist);
    expect(node2D.getCrux('f')).toBe(node2D.f);
});

test('test_str', () => {
    expect(node2D.str()).toBe('1,2');
    expect(node3D120.str()).toBe('1,2,0');
    expect(node3D123.str()).toBe('1,2,3');
});

test('test_equal', () => {
    expect(node2D.equal(new Node(1, 2))).toBe(true);
    expect(node2D.equal(new Node(1, 2, 0))).toBe(false);

    expect(node3D120.equal(new Node(1, 2, 0))).toBe(true);
    expect(node3D120.equal(new Node(1, 2))).toBe(false);

    expect(node3D123.equal(new Node(1, 2, 3))).toBe(true);
    expect(node3D123.equal(new Node(1, 2, 4))).toBe(false);
});

test('test_shift', () => {
    expect(node2D.shift(2, 1).equal(new Node(3, 3))).toBe(true);
    expect(node2D.shift(2, 1, 1).equal(new Node(3, 3))).toBe(true);

    expect(node3D120.shift(2, 1).equal(new Node(3, 3, 0))).toBe(true);
    expect(node3D120.shift(2, 1, 3).equal(new Node(3, 3, 3))).toBe(true);
});

test('test_direction_from', () => {
    expect(node2D.directionFrom(new Node(0, 1))).toStrictEqual([1, 1]);
    expect(node2D.directionFrom(new Node(1, 1))).toStrictEqual([0, 1]);
    expect(node2D.directionFrom(new Node(2, 1))).toStrictEqual([-1, 1]);
    expect(node2D.directionFrom(new Node(0, 2))).toStrictEqual([1, 0]);
    expect(node2D.directionFrom(new Node(1, 2))).toStrictEqual([0, 0]);
    expect(node2D.directionFrom(new Node(2, 2))).toStrictEqual([-1, 0]);
    expect(node2D.directionFrom(new Node(0, 3))).toStrictEqual([1, -1]);
    expect(node2D.directionFrom(new Node(1, 3))).toStrictEqual([0, -1]);
    expect(node2D.directionFrom(new Node(2, 3))).toStrictEqual([-1, -1]);

    expect(node3D120.directionFrom(node3D123)).toStrictEqual([0, 0, -1]);
});

test('test_distance_to', () => {
    expect(node2D.stepDistanceTo(new Node(4, 2))).toBe(3);
    expect(node2D.stepDistanceTo(new Node(4, 4))).toBe(Math.sqrt(2) * 2 + 1);
    expect(node3D120.stepDistanceTo(node3D123)).toBe(3);
    expect(node3D120.stepDistanceTo(node3D212)).toBe(Math.sqrt(2) + 2);

    expect(node2D.manhattanDistanceTo(new Node(3, 5))).toBe(5);
    expect(node3D120.manhattanDistanceTo(node3D212)).toBe(4);

    const factorD = Math.sqrt(2) - 1;
    expect(node2D.octileDistanceTo(new Node(3, 5))).toBe(factorD * 2 + 3);
    expect(node2D.octileDistanceTo(new Node(5, 3))).toBe(factorD + 4);

    expect(node3D120.octileDistanceTo(node3D123)).toBe(3);
    expect(node3D120.octileDistanceTo(node3D212)).toBe(factorD + 3);
});

test('test_is_out_of_bound', () => {
    expect(node2D.isOutOfBound({})).toBe(false);
    expect(node2D.isOutOfBound({boundZ: [-10, -5]})).toBe(false);
    expect(node2D.isOutOfBound({boundZ: [-1, 1]})).toBe(false);
    expect(node2D.isOutOfBound({boundZ: [-1, 1], boundX: [-1, 1]})).toBe(true);
    expect(node2D.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2]})).toBe(false);
    expect(node2D.isOutOfBound({boundZ: [-1, 1], boundY: [-2, 2]})).toBe(true);
    expect(node2D.isOutOfBound({boundZ: [-1, 1], boundY: [-3, 3]})).toBe(false);
    expect(node2D.isOutOfBound({boundZ: [-1, 1], boundX: [-1, 1], boundY: [-2, 2]})).toBe(true);
    expect(node2D.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2], boundY: [-3, 3]})).toBe(false);

    expect(node3D120.isOutOfBound({boundZ: [-10, -5]})).toBe(true);
    expect(node3D120.isOutOfBound({boundZ: [-1, 1]})).toBe(false);
    expect(node3D120.isOutOfBound({boundZ: [-1, 1], boundX: [-1, 1]})).toBe(true);
    expect(node3D120.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2]})).toBe(false);
    expect(node3D120.isOutOfBound({boundZ: [-1, 1], boundY: [-2, 2]})).toBe(true);
    expect(node3D120.isOutOfBound({boundZ: [-1, 1], boundY: [-3, 3]})).toBe(false);
    expect(node3D120.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2], boundY: [-2, 2]})).toBe(true);
    expect(node3D120.isOutOfBound({boundZ: [-1, 1], boundX: [-2, 2], boundY: [-3, 3]})).toBe(false);
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
    const startNode = new Node(start.x, start.y, start.z);

    const data = scenario.data;
    const indexObstacle = 0;
    const obstacleNode = new Node(data.x[indexObstacle], data.y[indexObstacle], data.z[indexObstacle]);
    const testNode = new Node(5, 9, 2);

    // expect(startNode.str()).toBe(obstacleNode.str());
    expect(startNode.str()).toBe(testNode.str());
});
