from pyhpp.grid import Grid
from pyhpp.model import Model

dimension_2D1 = {"x": 10, "y": 10}
dimension_2D2 = {"x": 10, "y": 10, "z": 0}
dimension_2D3 = {"x": 10, "y": 10, "z": -5}
dimension_3D = {"x": 10, "y": 10, "z": 10}


def test_is_2d():
    assert Model.is_two_dimensional(dimension_2D1) is True
    assert Model.is_two_dimensional(dimension_2D2) is True
    assert Model.is_two_dimensional(dimension_2D3) is True
    assert Model.is_two_dimensional(dimension_3D) is False


def test_check_num_obstacles():
    obstacle_array = Model.create_obstacle_array()
    assert len(obstacle_array) == 0

    scenario_empty_data = {
        "size": 0,
        "x": [1, 2, 3],
        "y": [1, 2, 3]
    }
    obstacle_empty_array = Model.create_obstacle_array(scenario_empty_data)
    assert len(obstacle_empty_array) == 0

    scenario_2d_data = {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        # "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    }
    obstacle_2D_array = Model.create_obstacle_array(scenario_2d_data)
    assert len(obstacle_2D_array) == int(scenario_2d_data["size"])

    scenario_3d_data = {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    }
    obstacle_3D_array = Model.create_obstacle_array(scenario_3d_data)
    assert len(obstacle_3D_array) == int(scenario_3d_data["size"])


def test_grids_on_obstacles():
    scenario_3d_data = {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    }
    obstacle_3D_array = Model.create_obstacle_array(scenario_3d_data)

    test_good_waypoint_array = [
        Grid(5, 9, 2),
        Grid(5, 0, 4)
    ]
    assert Model.grids_on_obstacles(obstacle_3D_array, test_good_waypoint_array) == False

    test_error_waypoint_array = [
        Grid(5, 9, 2),
        Grid(6, 6, 5)
    ]
    Model.grids_on_obstacles(obstacle_3D_array, test_error_waypoint_array) == True


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

    assert Model.is_boundary_available(zFloor, 0, zCeil) == False
    assert Model.is_boundary_available(zFloor, 6, zCeil) == False


def test_create_initial_Q():
    scenario_2d = {
        "dimension": {"x": 15, "y": 15},
        "waypoint": {
            "start": {"x": 12, "y": 0},
            "stop": {"x": 1, "y": 11},
            "allowDiagonal": False
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
    }

    obstacle_2D_array = Model.create_obstacle_array(scenario_2d["data"])
    model_2D = Model(scenario_2d["dimension"], obstacle_2D_array, scenario_2d["waypoint"])
    Q_2D = model_2D.create_initial_Q()

    number_obstacle_grids_2D = (int(scenario_2d["dimension"]["x"]) * int(scenario_2d["dimension"]["y"])) - int(scenario_2d["data"]["size"])
    assert len(Q_2D) == number_obstacle_grids_2D

    scenario_3d = {
        "dimension": { "x": 10, "y": 10, "z": 10 },
        "waypoint": {
            "start": {"x": 5, "y": 9, "z": 2},
            "stop": {"x": 6, "y": 6, "z": 5},
            "allowDiagonal": False
        },
        "data": {
            "size": 16,
            "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
            "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
        }
    }

    obstacle_3D_array = Model.create_obstacle_array(scenario_3d["data"])
    model3D = Model(scenario_3d["dimension"], obstacle_3D_array, scenario_3d["waypoint"])
    isFast = False
    original_Q_3D = model3D.create_initial_Q(isFast)

    number_obstacle_grids_3D = (int(scenario_3d["dimension"]["x"]) * int(scenario_3d["dimension"]["y"]) * int(scenario_3d["dimension"]["z"])) - int(scenario_3d["data"]["size"])
    assert len(original_Q_3D) == number_obstacle_grids_3D

    fast_Q_3D = model3D.create_initial_Q()
    assert len(fast_Q_3D) == number_obstacle_grids_3D
