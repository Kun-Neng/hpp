from math import inf
from pyhpp.node import Node

node_2D = Node(1, 2)
node_3D120 = Node(1, 2, 0)
node_3D123 = Node(1, 2, 3)


def test_is2d():
    assert node_2D.is_2d == True
    assert node_3D120.is_2d == False
    assert node_3D123.is_2d == False

def test_str():
    assert str(node_2D) == '1,2'
    assert str(node_3D120) == '1,2,0'
    assert str(node_3D123) == '1,2,3'

def test_equal():
    assert (node_2D == Node(1, 2)) == True
    assert (node_2D == Node(1, 2, 0)) == False

    assert (node_3D120 == Node(1, 2, 0)) == True
    assert (node_3D120 == Node(1, 2)) == False

    assert (node_3D123 == Node(1, 2, 3)) == True
    assert (node_3D123 == Node(1, 2, 4)) == False

def test_get_crux():
    assert (node_2D.get_crux('dist') == inf) == True
    assert (node_2D.get_crux('f') == inf) == True
    assert (node_2D.get_crux('') == inf) == True

    node_2D.dist = 1
    node_2D.f = 0.5
    assert (node_2D.get_crux('dist') == node_2D.dist) == True
    assert (node_2D.get_crux('f') == node_2D.f) == True

def test_shift():
    assert (node_2D.shift(2, 1) == Node(3, 3)) == True
    assert (node_2D.shift(2, 1, 1) == Node(3, 3)) == True

    assert (node_3D120.shift(2, 1) == Node(3, 3, 0)) == True
    assert (node_3D120.shift(2, 1, 3) == Node(3, 3, 3)) == True

def test_is_out_of_bound():
    assert node_2D.is_out_of_bound() == False
    assert node_2D.is_out_of_bound(bound_z = [-10, -5]) == False
    assert node_2D.is_out_of_bound(bound_z = [-1, 1]) == False
    assert node_2D.is_out_of_bound(bound_z = [-1, 1], bound_x = [-1, 1]) == True
    assert node_2D.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2]) == False
    assert node_2D.is_out_of_bound(bound_z = [-1, 1], bound_y = [-2, 2]) == True
    assert node_2D.is_out_of_bound(bound_z = [-1, 1], bound_y = [-3, 3]) == False
    assert node_2D.is_out_of_bound(bound_z = [-1, 1], bound_x = [-1, 1], bound_y = [-2, 2]) == True
    assert node_2D.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2], bound_y = [-3, 3]) == False

    assert node_3D120.is_out_of_bound(bound_z = [-10, -5]) == True
    assert node_3D120.is_out_of_bound(bound_z = [-1, 1]) == False
    assert node_3D120.is_out_of_bound(bound_z = [-1, 1], bound_x = [-1, 1]) == True
    assert node_3D120.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2]) == False
    assert node_3D120.is_out_of_bound(bound_z = [-1, 1], bound_y = [-2, 2]) == True
    assert node_3D120.is_out_of_bound(bound_z = [-1, 1], bound_y = [-3, 3]) == False
    assert node_3D120.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2], bound_y = [-2, 2]) == True
    assert node_3D120.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2], bound_y = [-3, 3]) == False

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
    start_node = Node(start["x"], start["y"], start["z"])

    data = scenario["data"]
    index_obstacle = 0
    obstacle_node = Node(data["x"][index_obstacle], data["y"][index_obstacle], data["z"][index_obstacle])
    test_node = Node(5, 9, 2)
    assert start_node != obstacle_node
    assert start_node == test_node
