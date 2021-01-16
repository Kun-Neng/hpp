import {AStar} from '../AStar';

test('test_calculate_path', () => {
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
    const aStar = new AStar(scenario);
    const result = aStar.calculatePath();
    const path = result.path;
    expect(path.x.length).toBe(14);
});
