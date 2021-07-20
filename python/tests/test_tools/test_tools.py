from pyhpp.model import Model
from pyhpp.tools import Tools

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


def test_find_the_min_F():
    obstacle_2D_array = Model.create_obstacle_array(scenario_2d["data"])
    model_2D = Model(scenario_2d["dimension"], obstacle_2D_array, scenario_2d["waypoint"])
    Q_2D = model_2D.create_initial_Q()

    min_grid_2D = Tools.find_the_minimum(Q_2D, 'f')
    assert min_grid_2D["key"] == '12,0'
    assert int(min_grid_2D["value"].dist) == 0

    obstacle_3D_array = Model.create_obstacle_array(scenario["data"])
    model_3D = Model(scenario["dimension"], obstacle_3D_array, scenario["waypoint"])
    is_fast = True
    fast_Q_3D = model_3D.create_initial_Q(is_fast)

    min_grid_3D = Tools.find_the_minimum(fast_Q_3D, 'f')
    assert min_grid_3D["key"] == '5,9,2'
    assert int(min_grid_3D["value"].dist) == 0

    is_fast = False
    original_Q_3D = model_3D.create_initial_Q(is_fast)

    original_min_grid_3D = Tools.find_the_minimum(original_Q_3D, 'f')
    assert original_min_grid_3D["key"] == '5,9,2'
    assert int(original_min_grid_3D["value"].dist) == 0