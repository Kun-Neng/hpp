import {AStar} from '../AStar';

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

test('test_constructor', () => {
    new AStar(scenarioWithWaypointsOnSomeObstacle);
    new AStar(scenarioWithWaypointsOutOfBoundary);

    new AStar(scenarioWithoutDiagonal);
    new AStar(scenarioWithoutBoundary);

    const scenarioWithoutCeil = {
        ...scenario,
        "boundary": {
            "zFloor": 1
        }
    };
    new AStar(scenarioWithoutCeil);

    const scenarioWithoutFloor = {
        ...scenario,
        "boundary": {
            "zCeil": 6
        }
    };
    new AStar(scenarioWithoutFloor);
});

test('test_calculate_path', () => {
    /**
     * Case 1: No results
     */
    const aStarNoResult2D = new AStar(scenario_2d_no_results);
    const noResult2D = aStarNoResult2D.calculatePath();
    expect(noResult2D.message).toBe('[Ready] No Results.');

    const aStarNoResult3D = new AStar(scenario_no_results);
    const noResult3D = aStarNoResult3D.calculatePath();
    expect(noResult3D.message).toBe('[Ready] No Results.');

    /**
     * Case 2: Arrival
     */
    const aStar2D = new AStar(scenario_2d);
    const result2D = aStar2D.calculatePath();
    expect(result2D.message).toBe('[Done] Arrival! 🚀');

    const aStar3D = new AStar(scenario);
    const result3D = aStar3D.calculatePath();
    expect(result3D.message).toBe('[Done] Arrival! 🚀');

    const scenario_2d_allow_diagonal = {
        ...scenario_2d, waypoint: {
            "start": {"x": 12, "y": 0},
            "stop": {"x": 1, "y": 11},
            "allowDiagonal": true
        }
    };
    const aStar2DDiagonal = new AStar(scenario_2d_allow_diagonal);
    const result2DDiagonal = aStar2DDiagonal.calculatePath();
    expect(result2DDiagonal.message).toBe('[Done] Arrival! 🚀');
    
    expect(result2DDiagonal.path.x[result2DDiagonal.path.x.length - 1])
        .toBe(scenario_2d_allow_diagonal.waypoint.stop.x);
    expect(result2DDiagonal.path.y[result2DDiagonal.path.y.length - 1])
        .toBe(scenario_2d_allow_diagonal.waypoint.stop.y);

    const scenario_3d_allow_diagonal = {
        ...scenario, waypoint: {
            "start": {"x": 5, "y": 9, "z": 2},
            "stop": {"x": 5, "y": 0, "z": 4},
            "allowDiagonal": true
        }
    };
    const aStar3DDiagonal = new AStar(scenario_3d_allow_diagonal);
    const result3DDiagonal = aStar3DDiagonal.calculatePath();
    expect(result3DDiagonal.message).toBe('[Done] Arrival! 🚀');

    expect(result3DDiagonal.path.x[result3DDiagonal.path.x.length - 1])
        .toBe(scenario_3d_allow_diagonal.waypoint.stop.x);
    expect(result3DDiagonal.path.y[result3DDiagonal.path.y.length - 1])
        .toBe(scenario_3d_allow_diagonal.waypoint.stop.y);
    expect(result3DDiagonal.path.z[result3DDiagonal.path.z.length - 1])
        .toBe(scenario_3d_allow_diagonal.waypoint.stop.z);
    
    const originalOptions = {debugMode: true, type: 'original'};
    const originalAStar3DDiagonal = new AStar(scenario_3d_allow_diagonal, originalOptions);
    const originalResult3DDiagonal = originalAStar3DDiagonal.calculatePath();
    expect(originalResult3DDiagonal.message).toBe('[Done] Arrival! 🚀');

    const fastOptions = {debugMode: false, type: 'fast'};
    const fastAStar3DDiagonal = new AStar(scenario_3d_allow_diagonal, fastOptions);
    const fastResult3DDiagonal = fastAStar3DDiagonal.calculatePath();
    expect(fastResult3DDiagonal.message).toBe('[Done] Arrival! 🚀');

    const otherTypeOptions = {debugMode: false, type: undefined};
    const otherAStar3DDiagonal = new AStar(scenario_3d_allow_diagonal, otherTypeOptions);
    const otherResult3DDiagonal = otherAStar3DDiagonal.calculatePath();
    expect(otherResult3DDiagonal.message).toBe('[Done] Arrival! 🚀');
});
