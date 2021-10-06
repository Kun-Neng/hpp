import copy
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

scenario_empty_grouping_without_boundary = {
    "dimension": { "x": 10, "y": 10, "z": 10 },
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "waypoint": {
        "start": { "x": 5, "y": 9, "z": 2 },
        "stop": { "x": 5, "y": 0, "z": 4 },
        "allowDiagonal": False
    },
    "grouping": {}
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
        "size": 8,
        "x": [11, 11, 11, 12, 12, 13, 13, 13],
        "y": [-1,  0,  1, -1,  1, -1,  0,  1]
        # "x": [ 0,  1,  2,  2,
        #        2,  2,  2,  2,  2,  2,  2,  2,
        #        3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
        #       12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        # "y": [ 5,  5, 13, 14,
        #        5,  6,  7,  8,  9, 10, 11, 12,
        #       12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
        #        2,  3,  4,  5,  6,  7,  8,  9, 10, 11]
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

    scenario_grouping_without_obstacles_inside = copy.deepcopy(scenario_empty_grouping_without_boundary)
    scenario_grouping_without_obstacles_inside["grouping"] = { "radius": 2 }
    AStar(scenario_grouping_without_obstacles_inside)

    scenario_obstacles_in_sphere1 = copy.deepcopy(scenario_empty_grouping_without_boundary)
    scenario_obstacles_in_sphere1["grouping"] = { "radius": 5 }
    AStar(scenario_obstacles_in_sphere1)

    scenario_obstacles_in_sphere2 = copy.deepcopy(scenario_empty_grouping_without_boundary)
    scenario_obstacles_in_sphere2["grouping"] = { "radius": 10 }
    AStar(scenario_obstacles_in_sphere2)

    scenario_obstacles_in_both_circles = copy.deepcopy(scenario_empty_grouping_without_boundary)
    scenario_obstacles_in_both_circles["boundary"] = { "zCeil": 6, "zFloor": 1 }
    scenario_obstacles_in_both_circles["grouping"] = { "radius": 10 }
    AStar(scenario_obstacles_in_both_circles)


def test_calculate_path():
    '''
    Case 1: No results
    '''
    astar_no_result_2D = AStar(scenario_2d_no_results)
    no_result_2D = astar_no_result_2D.calculate_path()
    assert no_result_2D["message"] == '[Done] no results.'

    astar_no_result_3D = AStar(scenario_no_results)
    no_result_3D = astar_no_result_3D.calculate_path()
    assert no_result_3D["message"] == '[Done] no results.'

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

    '''
    Case 3: 2D Grouping
    '''
    scenario_grouping_2D = copy.deepcopy(scenario_2d)
    scenario_grouping_2D["grouping"] = { "radius": 0.4 }
    aStar_grouping_2D = AStar(scenario_grouping_2D)
    result_grouping_2D = aStar_grouping_2D.calculate_path()
    assert result_grouping_2D["message"] == '[Done] Arrival! 🚀'

    scenario_grouping_no_result_2D = copy.deepcopy(scenario_2d_no_results)
    scenario_grouping_no_result_2D["grouping"] = { "radius": 1 }
    aStar_grouping_no_result_2D = AStar(scenario_grouping_no_result_2D)
    no_result_grouping_2D = aStar_grouping_no_result_2D.calculate_path()
    assert no_result_grouping_2D["message"] == '[Path Error] no results due to obstacles in START area.'

    scenario_grouping_obstacle_on_stop_no_result_2D = copy.deepcopy(scenario_grouping_no_result_2D)
    scenario_grouping_obstacle_on_stop_no_result_2D["data"] = {
        "size": 8,
        "x": [ 0,  0,  0,  1,  1,  2,  2,  2],
        "y": [10, 11, 12, 10, 12, 10, 11, 12]
    }
    aStar_grouping_obstacle_on_stop_no_result_2D = AStar(scenario_grouping_obstacle_on_stop_no_result_2D)
    no_result_grouping_obstacle_on_stop_2D = aStar_grouping_obstacle_on_stop_no_result_2D.calculate_path()
    assert no_result_grouping_obstacle_on_stop_2D["message"] == '[Path Error] no results due to obstacles in STOP area.'

    '''
    Case 3: 3D Grouping
    '''
    aStar_3D_empty_grouping_without_boundary = AStar(scenario_empty_grouping_without_boundary)
    result_3D_empty_grouping_without_boundary = aStar_3D_empty_grouping_without_boundary.calculate_path()
    assert result_3D_empty_grouping_without_boundary["message"] == '[Done] Arrival! 🚀'

    scenario_grouping_without_boundary = copy.deepcopy(scenario_empty_grouping_without_boundary)
    scenario_grouping_without_boundary["grouping"] = { "radius": 2 }
    aStar_3D_grouping_without_boundary = AStar(scenario_grouping_without_boundary)
    result_3D_grouping_without_boundary = aStar_3D_grouping_without_boundary.calculate_path()
    assert result_3D_grouping_without_boundary["message"] == '[Done] Arrival! 🚀'

    scenario_grouping_with_boundary = copy.deepcopy(scenario_grouping_without_boundary)
    scenario_grouping_with_boundary["boundary"] = { "zCeil": 6, "zFloor": 1 }
    aStar_3D_grouping_with_boundary = AStar(scenario_grouping_with_boundary)
    result_3D_grouping_with_boundary = aStar_3D_grouping_with_boundary.calculate_path()
    assert result_3D_grouping_with_boundary["message"] == '[Done] Arrival! 🚀'

    '''
    Case 4: Options
    debugMode: True | False
    type: 'original' | 'fast'
    '''
    
    options = {'type': 'original'}
    original_astar_3D_diagonal = AStar(scenario_3d_allow_diagonal, options)
    original_result_3D_diagonal = original_astar_3D_diagonal.calculate_path()
    assert original_result_3D_diagonal["message"] == '[Done] Arrival! 🚀'

    fast_options = {'debugMode': False, 'type': 'fast'}
    fast_aStar_3D_diagonal = AStar(scenario_3d_allow_diagonal, fast_options)
    fast_result_3D_diagonal = fast_aStar_3D_diagonal.calculate_path()
    assert fast_result_3D_diagonal["message"] == '[Done] Arrival! 🚀'

    other_type_options = {'debugMode': False}
    other_aStar_3D_diagonal = AStar(scenario_3d_allow_diagonal, other_type_options)
    other_result_3D_diagonal = other_aStar_3D_diagonal.calculate_path()
    assert other_result_3D_diagonal["message"] == '[Done] Arrival! 🚀'
