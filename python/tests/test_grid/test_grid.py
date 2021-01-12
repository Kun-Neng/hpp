from pyhpp.grid import Grid


def test_object_collision():
    scenario = {
        "waypoint": {
            "start": {"x": 5, "y": 9, "z": 2},
            "stop": {"x": 5, "y": 0, "z": 4},
            "allowDiagonal": False
        },
        "data": {
            "size": 16,
            "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
            "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
        }
    }
    start = scenario["waypoint"]["start"]
    start_grid = Grid(start["x"], start["y"], start["z"], False)

    data = scenario["data"]
    index_obstacle = 0
    obstacle_grid = Grid(data["x"][index_obstacle], data["y"][index_obstacle], data["z"][index_obstacle], False)
    test_grid = Grid(5, 9, 2, False)
    assert start_grid != obstacle_grid
    assert start_grid == test_grid
