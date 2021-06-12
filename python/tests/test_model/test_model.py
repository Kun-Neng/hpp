from pyhpp.model import Model


def test_is_2d():
    scenario = {
        "dimension": {"x": 10, "y": 10, "z": 10}
    }
    dimension = scenario["dimension"]
    is_2d = Model.is_two_dimensional(dimension)
    assert is_2d is False


def test_check_num_obstacles():
    scenario = {
        "data": {
            "size": 16,
            "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
            "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
        }
    }
    is_2d = False
    obstacle_array = Model.create_obstacle_array(scenario["data"], is_2d)
    num_obstacles = len(obstacle_array)
    assert num_obstacles == scenario["data"]["size"]


def test_boundary():
    scenario = {
        "waypoint": {
            "start": {"x": 5, "y": 9, "z": 2},
            "stop": {"x": 5, "y": 0, "z": 4},
            "allowDiagonal": False
        },
        "boundary": {
            "zCeil": 6,
            "zFloor": 1
        }
    }
    zStart = int(scenario["waypoint"]["start"]["z"])
    zCeil = int(scenario["boundary"]["zCeil"])
    zFloor = int(scenario["boundary"]["zFloor"])
    assert Model.is_boundary_available(zFloor, zStart, zCeil)
