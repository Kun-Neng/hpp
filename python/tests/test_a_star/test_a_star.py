import copy
from pyhpp.grid import Grid
from pyhpp.a_star import AStar

scenario_with_waypoints_on_some_obstacle = {
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
        "allowDiagonal": False
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
}

scenario_with_waypoints_out_of_boundary = {
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
        "allowDiagonal": False
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 3
    }
}

scenario_without_diagonal = {
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
}

scenario_without_boundary = {
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
        "allowDiagonal": False
    }
}

scenario_no_results = {
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
        "allowDiagonal": False
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
}

scenario = {
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
        "allowDiagonal": False
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
}

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

scenario_2d_no_results = {
    "dimension": {"x": 15, "y": 15},
    "waypoint": {
        "start": {"x": 12, "y": 0},
        "stop": {"x": 1, "y": 11},
        "allowDiagonal": False
    },
    "data": {
        "size": 28,
        "x": [ 0,  1,  2,  2,
               2,  2,  2,  2,  2,  2,  2,  2,
               3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
              12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        "y": [ 5,  5, 13, 14,
               5,  6,  7,  8,  9, 10, 11, 12,
              12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
               2,  3,  4,  5,  6,  7,  8,  9, 10, 11]
    }
}


def test_constructor():
    AStar(scenario_with_waypoints_on_some_obstacle)
    AStar(scenario_with_waypoints_out_of_boundary)

    AStar(scenario_without_diagonal)
    AStar(scenario_without_boundary)

    scenario_without_ceil = copy.deepcopy(scenario)
    scenario_without_ceil["boundary"] = { "zFloor": 1 }
    AStar(scenario_without_ceil)

    scenario_without_floor = copy.deepcopy(scenario)
    scenario_without_floor["boundary"] = { "zCeil": 6 }
    AStar(scenario_without_floor)


def test_create_path_from_finalQ():
    astar_no_result_2D = AStar(scenario_2d_no_results)
    dict_2D = dict({'6,6': Grid(6, 6)})
    result_2D = astar_no_result_2D.create_path_from_final_Q(dict_2D)
    assert int(result_2D["x"][0]) == 12
    assert int(result_2D["y"][0]) == 0
    assert len(result_2D["z"]) == 0


def test_calculate_path():
    '''
    Case 1: No results
    '''
    astar_no_result_2D = AStar(scenario_2d_no_results)
    no_result_2D = astar_no_result_2D.calculate_path()
    assert no_result_2D["message"] == '[Ready] No Results.'

    astar_no_result_3D = AStar(scenario_no_results)
    no_result_3D = astar_no_result_3D.calculate_path()
    assert no_result_3D["message"] == '[Ready] No Results.'

    '''
    Case 2: Arrival
    '''
    astar_2D = AStar(scenario_2d)
    result_2D = astar_2D.calculate_path()
    assert result_2D["message"] == '[Done] Arrival! 🚀'

    astar_3D = AStar(scenario)
    result_3D = astar_3D.calculate_path()
    assert result_3D["message"] == '[Done] Arrival! 🚀'

    scenario_2d_allow_diagonal = copy.deepcopy(scenario_2d)
    scenario_2d_allow_diagonal["waypoint"] = {
        "start": {"x": 12, "y": 0},
        "stop": {"x": 1, "y": 11},
        "allowDiagonal": True
    }
    astar_2D_diagonal = AStar(scenario_2d_allow_diagonal)
    result_2D_diagonal = astar_2D_diagonal.calculate_path()
    assert result_2D_diagonal["message"] == '[Done] Arrival! 🚀'

    assert result_2D_diagonal["path"]["x"][len(result_2D_diagonal["path"]["x"]) - 1] == int(scenario_2d_allow_diagonal["waypoint"]["stop"]["x"])
    assert result_2D_diagonal["path"]["y"][len(result_2D_diagonal["path"]["y"]) - 1] == int(scenario_2d_allow_diagonal["waypoint"]["stop"]["y"])
    
    scenario_3d_allow_diagonal = copy.deepcopy(scenario)
    scenario_3d_allow_diagonal["waypoint"] = {
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": True
    }
    astar_3D_diagonal = AStar(scenario_3d_allow_diagonal)
    result_3D_diagonal = astar_3D_diagonal.calculate_path()
    assert result_3D_diagonal["message"] == '[Done] Arrival! 🚀'

    assert result_3D_diagonal["path"]["x"][len(result_3D_diagonal["path"]["x"]) - 1] == int(scenario_3d_allow_diagonal["waypoint"]["stop"]["x"])
    assert result_3D_diagonal["path"]["y"][len(result_3D_diagonal["path"]["y"]) - 1] == int(scenario_3d_allow_diagonal["waypoint"]["stop"]["y"])
    assert result_3D_diagonal["path"]["z"][len(result_3D_diagonal["path"]["z"]) - 1] == int(scenario_3d_allow_diagonal["waypoint"]["stop"]["z"])

    options = {'type': 'original'}
    original_astar_3D_diagonal = AStar(scenario_3d_allow_diagonal, options)
    original_result_3D_diagonal = original_astar_3D_diagonal.calculate_path()
    assert original_result_3D_diagonal["message"] == '[Done] Arrival! 🚀'
