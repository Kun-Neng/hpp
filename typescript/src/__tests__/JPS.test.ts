import {Node} from '../Node';
import {JPS} from '../JPS';

const scenarioWithWaypointsOnSomeObstacle = {
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
        "stop": {"x": 5, "y": 6, "z": 5},
        "allowDiagonal": false
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
};

const scenarioWithWaypointsOutOfBoundary = {
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
        "stop": {"x": 5, "y": 6, "z": 5},
        "allowDiagonal": false
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 3
    }
};

const scenarioWithoutDiagonal = {
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
        "stop": {"x": 5, "y": 0, "z": 4}
    }
};

const scenarioWithoutBoundary = {
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
    }
};

const scenario_no_results = {
    "dimension": {"x": 10, "y": 10, "z": 10},
    "empty_data": {},
    "no_data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 48,
        "x": [
            4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7,
            4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7,
            4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7, 7, 7, 7, 7
        ],
        "y": [
            7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
            10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
            8, 8, 8, 8, 9, 9, 9, 9, 8, 8, 8, 8, 9, 9, 9, 9
        ],
        "z": [
            2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
            2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
            2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5
        ]
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

const small_2d_scenario = {
    "dimension": {"x": 15, "y": 15},
    "waypoint": {
        "start": {"x": 12, "y": 0},
        "stop": {"x": 1, "y": 11},
        "allowDiagonal": false
    },
    "data": {
        "size": 29,
        "x": [ 2,  2,  2,  2,  2,  2,  2,  2,
               3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
              12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13],
        "y": [ 5,  6,  7,  8,  9, 10, 11, 12,
              12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
               2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 11]
    }
};

const medium_2d_scenario = {
    "dimension": {"x": 20, "y": 20, "z": 0},
    "data": {
        "size": 107,
        "x": [ 9, 14, 4, 7, 9, 11, 12, 14, 17, 4, 9, 12, 14, 17, 4, 9,
               0, 1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19,
               4, 9, 4, 14, 18, 4, 9, 14,
               1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
               16, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16,
               1, 13, 1, 13, 1, 4, 5, 6, 7, 8, 9, 10, 13,
               1, 4, 10, 13, 1, 4, 10, 13, 1, 4, 10, 13,
               1, 4, 5, 6, 8, 9, 10, 13, 1, 13],
        "y": [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3,
               4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
               5, 5, 6, 6, 6, 7, 7, 7,
               8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
               10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
               12, 12, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14,
               15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17,
               18, 18, 18, 18, 18, 18, 18, 18, 19, 19]
    },
    "waypoint": {
        "start": {"x": 7, "y": 15, "z": 0},
        "stop": {"x": 10, "y": 0, "z": 0},
        "allowDiagonal": true
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
        // "size": 8,
        // "x": [11, 11, 11, 12, 12, 13, 13, 13],
        // "y": [-1,  0,  1, -1,  1, -1,  0,  1]
        "size": 5,
        "x": [11, 11, 12, 13, 13],
        "y": [ 0,  1,  1,  0,  1]
    }
};

test('test_constructor', () => {
    new JPS(scenarioWithWaypointsOnSomeObstacle);
    new JPS(scenarioWithWaypointsOutOfBoundary);

    new JPS(scenarioWithoutDiagonal);
    new JPS(scenarioWithoutBoundary);

    const scenarioWithoutCeil = {
        ...scenario,
        "boundary": {
            "zFloor": 1
        }
    };
    new JPS(scenarioWithoutCeil);

    const scenarioWithoutFloor = {
        ...scenario,
        "boundary": {
            "zCeil": 6
        }
    };
    new JPS(scenarioWithoutFloor);
});

test('test_get_neighbors', () => {
    const jps = new JPS(small_2d_scenario);

    const neighborsWithoutObstacle = jps.getNeighbors(new Node(6, 6));
    expect(neighborsWithoutObstacle.length).toBe(8);

    const neighborsWithObstacle = jps.getNeighbors(new Node(13, 1));
    const walkableNeighbors = neighborsWithObstacle.filter(neighbor => neighbor.isObstacle === false);
    expect(walkableNeighbors.length).toBe(7);

    const neighborsOutOfBound = jps.getNeighbors(new Node(1, 0));
    expect(neighborsOutOfBound.length).toBe(5);
});

test('test_check_is_node_natural', () => {
    const jps = new JPS(small_2d_scenario);

    // start node
    const startNode = new Node(6, 6);
    const neighborsWithoutObstacle = jps.getNeighbors(startNode);
    neighborsWithoutObstacle.forEach(neighbor => {
        expect(jps.checkIsNodeNatural(startNode, neighbor)).toStrictEqual(true);
    });

    const prevStraightNode = new Node(5, 6);
    startNode.prev = prevStraightNode;
    neighborsWithoutObstacle.forEach(neighbor => {
        if (neighbor.equal(new Node(7, 6))) {
            expect(jps.checkIsNodeNatural(startNode, neighbor)).toStrictEqual(true);
        } else {
            expect(jps.checkIsNodeNatural(startNode, neighbor)).toStrictEqual(false);
        }
    });

    const prevDiagonalNode = new Node(7, 5);
    startNode.prev = prevDiagonalNode;
    neighborsWithoutObstacle.forEach(neighbor => {
        if (neighbor.equal(new Node(5, 6)) || neighbor.equal(new Node(5, 7)) || neighbor.equal(new Node(6, 7))) {
            expect(jps.checkIsNodeNatural(startNode, neighbor)).toStrictEqual(true);
        } else {
            expect(jps.checkIsNodeNatural(startNode, neighbor)).toStrictEqual(false);
        }
    });
});

test('test_prune', () => {
    const jps = new JPS(small_2d_scenario);

    // start node
    const startNode = new Node(6, 6);
    const neighborsWithoutObstacle = jps.getNeighbors(startNode);
    const candidateNeighbors = jps.prune(startNode, neighborsWithoutObstacle);
    candidateNeighbors.forEach(neighbor => {
        expect(jps.checkIsNodeNatural(startNode, neighbor)).toStrictEqual(true);
    });

    // straight move (X)
    const nodeS1 = new Node(2, 4);
    const prevNodeS1 = new Node(1, 4);
    nodeS1.prev = prevNodeS1;
    const neighborsS1 = jps.getNeighbors(nodeS1);
    jps.prune(nodeS1, neighborsS1).forEach(neighbor => {
        if (neighbor.equal(new Node(2, 5))) {
            expect(neighbor.isObstacle).toStrictEqual(true);
        } else if (neighbor.equal(new Node(3, 5))) {
            expect(neighbor.isForced).toStrictEqual(true);
        } else if (neighbor.equal(new Node(3, 4))) {
            expect(neighbor.isNatural).toStrictEqual(true);
        } else {
            expect(neighbor.isNatural).toStrictEqual(false);
        }
    });

    // straight move (Y)
    const nodeS2 = new Node(3, 5);
    const prevNodeS2 = new Node(3, 6);
    nodeS2.prev = prevNodeS2;
    const neighborsS2 = jps.getNeighbors(nodeS2);
    jps.prune(nodeS2, neighborsS2).forEach(neighbor => {
        if (neighbor.equal(new Node(2, 5)) || neighbor.equal(new Node(2, 6))) {
            expect(neighbor.isObstacle).toStrictEqual(true);
        } else if (neighbor.equal(new Node(2, 4))) {
            expect(neighbor.isForced).toStrictEqual(true);
        } else if (neighbor.equal(new Node(3, 4))) {
            expect(neighbor.isNatural).toStrictEqual(true);
        } else {
            expect(neighbor.isNatural).toStrictEqual(false);
        }
    });

    // diagonal move (X)
    const nodeD1 = new Node(2, 4);
    const prevNodeD1 = new Node(3, 5);
    nodeD1.prev = prevNodeD1;
    const neighborsD1 = jps.getNeighbors(nodeD1);
    jps.prune(nodeD1, neighborsD1).forEach(neighbor => {
        if (neighbor.equal(new Node(2, 5))) {
            expect(neighbor.isObstacle).toStrictEqual(true);
        } else if (neighbor.equal(new Node(1, 5))) {
            expect(neighbor.isForced).toStrictEqual(true);
        } else if (neighbor.equal(new Node(1, 3)) || neighbor.equal(new Node(1, 4)) || neighbor.equal(new Node(2, 3))) {
            expect(neighbor.isNatural).toStrictEqual(true);
        } else {
            expect(neighbor.isNatural).toStrictEqual(false);
        }
    });

    // diagonal move (X)
    const nodeD2 = new Node(14, 11);
    const prevNodeD2 = new Node(13, 10);
    nodeD2.prev = prevNodeD2;
    const neighborsD2 = jps.getNeighbors(nodeD2);
    jps.prune(nodeD2, neighborsD2).forEach(neighbor => {
        if (neighbor.equal(new Node(13, 11))) {
            expect(neighbor.isObstacle).toStrictEqual(true);
        } else if (neighbor.equal(new Node(13, 12))) {
            expect(neighbor.isForced).toStrictEqual(true);
        } else if (neighbor.equal(new Node(14, 12))) {
            expect(neighbor.isNatural).toStrictEqual(true);
        } else {
            expect(neighbor.isNatural).toStrictEqual(false);
        }
    });
});

test('test_jump', () => {
    const jps = new JPS(small_2d_scenario);

    // start node
    const startNode = new Node(6, 6);
    expect(jps.jump(startNode, [1, 0])).toBe(null);
    expect(jps.jump(startNode, [0, -1])).toBe(null);
    const jumpNode1 = jps.jump(new Node(9, 6), [1, 1]);
    if (jumpNode1) {
        expect(jumpNode1.str()).toBe(new Node(10, 7).str());
    }
    const jumpNode2 = jps.jump(startNode, [-1, -1]);
    if (jumpNode2) {
        expect(jumpNode2.str()).toBe(new Node(4, 4).str());
    }

    // stop node
    const stopNode = new Node(1, 11);
    const fromNode = new Node(1, 5);
    const jumpNode3 = jps.jump(fromNode, [0, 1]);
    if (jumpNode3) {
        expect(jumpNode3.str()).toBe(stopNode.str());
    }

    const node = new Node(8, 4);
    const jumpNode4 = jps.jump(node, [-1, 0]);
    if (jumpNode4) {
        expect(jumpNode4.str()).toBe(new Node(2, 4).str());
    }
});

test('test_identify_successors', () => {
    const jps = new JPS(scenario_2d_no_results);
    
    // start node
    const startNode = new Node(12, 0);
    jps.identifySuccessors(startNode);

    const currNode = new Node(6, 6);
    jps.identifySuccessors(currNode);
});

test('test_calculate_path', () => {
    const jps = new JPS(medium_2d_scenario);
    const result = jps.calculatePath();
    expect(result.message).toBe('[Done] Arrival! 🚀');
});
