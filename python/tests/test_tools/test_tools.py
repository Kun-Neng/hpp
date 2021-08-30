from pyhpp.node import Node
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

    min_node_2D = Tools.find_the_minimum(Q_2D, 'f')
    assert min_node_2D["key"] == '12,0'
    assert int(min_node_2D["value"].dist) == 0

    obstacle_3D_array = Model.create_obstacle_array(scenario["data"])
    model_3D = Model(scenario["dimension"], obstacle_3D_array, scenario["waypoint"])
    is_fast = True
    fast_Q_3D = model_3D.create_initial_Q(is_fast)

    min_node_3D = Tools.find_the_minimum(fast_Q_3D, 'f')
    assert min_node_3D["key"] == '5,9,2'
    assert int(min_node_3D["value"].dist) == 0

    is_fast = False
    original_Q_3D = model_3D.create_initial_Q(is_fast)

    original_min_node_3D = Tools.find_the_minimum(original_Q_3D, 'f')
    assert original_min_node_3D["key"] == '5,9,2'
    assert int(original_min_node_3D["value"].dist) == 0


def test_intersect():
    assert Tools.intersect(Node(1, 1), Node(1, 2.5)) == True

    group_center_2D = Node(2.999, 5)
    obstacle_2D = Node(5, 5)
    critical_distance_2D = 1.5
    assert Tools.intersect(group_center_2D, obstacle_2D, critical_distance_2D, True) == False

    intersected_group_center_2D = Node(3, 5)
    assert Tools.intersect(intersected_group_center_2D, obstacle_2D, critical_distance_2D, True) == True

    group_center_3D = Node(2.999, 5, 4)
    obstacle_3D = Node(5, 5, 5)
    critical_distance_3D = 1.582
    assert Tools.intersect(group_center_3D, obstacle_3D, critical_distance_3D, False) == False

    intersected_group_center_3D = Node(3, 5, 4)
    assert Tools.intersect(intersected_group_center_3D, obstacle_3D, critical_distance_3D, False) == True


def test_create_path_from_finalQ():
    start_node = Node(12, 0)
    stop_node = Node(1, 11)
    dict_2D = dict()

    no_result_2D = Tools.create_path_from_final_Q(dict_2D, start_node)
    assert int(no_result_2D["x"][0]) == int(start_node.x)
    assert int(no_result_2D["y"][0]) == int(start_node.y)
    assert len(no_result_2D["z"]) == int(0)

    last_node = Node(6, 6)
    start_node.prev = last_node
    dict_2D[str(last_node)] = last_node
    partial_result_2D = Tools.create_path_from_final_Q(dict_2D, last_node)
    assert int(partial_result_2D["x"][0]) == int(last_node.x)
    assert int(partial_result_2D["y"][0]) == int(last_node.y)

    last_node.prev = stop_node
    great_result_2D = Tools.create_path_from_final_Q(dict_2D, stop_node)
    assert int(great_result_2D["x"][0]) == int(stop_node.x)
    assert int(great_result_2D["y"][0]) == int(stop_node.y)


def test_is_collinear():
    startPoint2D = {"x": 5, "y": 2}
    nextPoint2D = {"x": 5, "y": 4}
    futurePoint2D = {"x": 5, "y": 10}
    assert Tools.is_collinear(startPoint2D, nextPoint2D, futurePoint2D) == True

    testPoint2D1 = {"x": 8, "y": 10}
    assert Tools.is_collinear(startPoint2D, nextPoint2D, testPoint2D1) == False

    startPoint3D = {"x": 2, "y": 2, "z": 3}
    nextPoint3D = {"x": 2, "y": 2, "z": 6}
    futurePoint3D = {"x": 2, "y": 2, "z": 8}
    assert Tools.is_collinear(startPoint3D, nextPoint3D, futurePoint3D) == True

    testPoint3D1 = {"x": 2, "y": 4, "z": 10}
    assert Tools.is_collinear(startPoint3D, nextPoint3D, testPoint3D1) == False


def test_refine_path_from_collinearity():
    zero_lengths_path = Tools.refine_path_from_collinearity({ "x": [], "y": [] })
    assert zero_lengths_path is None
    zero_z_length_path = Tools.refine_path_from_collinearity({ "x": [1, 2, 3], "y": [1, 1, 1], "z": [] })
    assert len(zero_z_length_path["x"]) == 2
    inconsistent_length_path_2d = Tools.refine_path_from_collinearity({ "x": [1, 2, 3], "y": [1, 1, 1, 1] })
    assert inconsistent_length_path_2d is None
    inconsistent_length_path_3d = Tools.refine_path_from_collinearity({ "x": [1, 2, 3], "y": [1, 1, 1], "z": [2] })
    assert inconsistent_length_path_3d is None

    short_lengths_path_2d_1 = Tools.refine_path_from_collinearity({ "x": [1], "y": [2] })
    assert len(short_lengths_path_2d_1["x"]) == 1
    short_lengths_path_2d_2 = Tools.refine_path_from_collinearity({ "x": [1, 1], "y": [2, 2] })
    assert len(short_lengths_path_2d_2["x"]) == 2
    short_lengths_path_3d_1 = Tools.refine_path_from_collinearity({ "x": [1], "y": [2], "z": [3] })
    assert len(short_lengths_path_3d_1["x"]) == 1
    short_lengths_path_3d_2 = Tools.refine_path_from_collinearity({ "x": [1, 1], "y": [2, 2], "z": [3, 3] })
    assert len(short_lengths_path_3d_2["x"]) == 2

    non_diagonal_path_2d_last_three_collinear = {
        "x": [12, 12, 11, 11, 11, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1],
        "y": [ 0,  1,  1,  2,  3,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5]
    }  #       o   o   o           o                              o  o
    refined_non_diagonal_path_2d_last_three_collinear = Tools.refine_path_from_collinearity(non_diagonal_path_2d_last_three_collinear, True)
    # print(refined_non_diagonal_path_2d_last_three_collinear)
    assert len(refined_non_diagonal_path_2d_last_three_collinear["x"]) == 6
    
    non_diagonal_path_2d = {
        "x": [12, 12, 11, 11, 11, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1,  1,  1],
        "y": [ 0,  1,  1,  2,  3,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9, 10, 11]
    }  #       o   o   o           o                              o                      o
    refined_non_diagonal_path_2d = Tools.refine_path_from_collinearity(non_diagonal_path_2d, True)
    # print(refined_non_diagonal_path_2d)
    assert len(refined_non_diagonal_path_2d["x"]) == 6

    non_diagonal_path = {
        "x": [5, 5, 5, 4, 3, 3, 3, 3, 3, 3, 4, 4, 5, 5],
        "y": [9, 8, 7, 7, 7, 6, 5, 4, 3, 2, 2, 1, 1, 0],
        "z": [2, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 4, 4]
    }  #      o     o     o     o     o  o  o  o  o  o
    refined_non_diagonal_path = Tools.refine_path_from_collinearity(non_diagonal_path, True)
    # print(refined_non_diagonal_path)
    assert len(non_diagonal_path["x"]) == 14
    assert len(refined_non_diagonal_path["x"]) == 10

    diagonal_path = {
        "x": [5, 5, 4, 3, 3, 3, 4, 4, 5, 5, 5],
        "y": [9, 8, 7, 6, 5, 4, 3, 2, 3, 2, 1],
        "z": [2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4]
    }  #      o  o     o     o  o  o  o     o
    refined_diagonal_path = Tools.refine_path_from_collinearity(diagonal_path, True)
    # print(refined_diagonal_path)
    assert len(diagonal_path["x"]) == 11
    assert len(refined_diagonal_path["x"]) == 8
