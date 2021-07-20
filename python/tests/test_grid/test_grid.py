from math import inf
from pyhpp.grid import Grid

grid_2D = Grid(1, 2)
grid_3D120 = Grid(1, 2, 0)
grid_3D123 = Grid(1, 2, 3)


def test_is2d():
    assert grid_2D.is_2d == True
    assert grid_3D120.is_2d == False
    assert grid_3D123.is_2d == False

def test_str():
    assert str(grid_2D) == '1,2'
    assert str(grid_3D120) == '1,2,0'
    assert str(grid_3D123) == '1,2,3'

def test_equal():
    assert (grid_2D == Grid(1, 2)) == True
    assert (grid_2D == Grid(1, 2, 0)) == False

    assert (grid_3D120 == Grid(1, 2, 0)) == True
    assert (grid_3D120 == Grid(1, 2)) == False

    assert (grid_3D123 == Grid(1, 2, 3)) == True
    assert (grid_3D123 == Grid(1, 2, 4)) == False

def test_get_crux():
    assert (grid_2D.get_crux('dist') == inf) == True
    assert (grid_2D.get_crux('f') == inf) == True
    assert (grid_2D.get_crux('') == inf) == True

    grid_2D.dist = 1
    grid_2D.f = 0.5
    assert (grid_2D.get_crux('dist') == grid_2D.dist) == True
    assert (grid_2D.get_crux('f') == grid_2D.f) == True

def test_shift():
    assert (grid_2D.shift(2, 1) == Grid(3, 3)) == True
    assert (grid_2D.shift(2, 1, 1) == Grid(3, 3)) == True

    assert (grid_3D120.shift(2, 1) == Grid(3, 3, 0)) == True
    assert (grid_3D120.shift(2, 1, 3) == Grid(3, 3, 3)) == True

def test_is_out_of_bound():
    assert grid_2D.is_out_of_bound() == False
    assert grid_2D.is_out_of_bound(bound_z = [-10, -5]) == False
    assert grid_2D.is_out_of_bound(bound_z = [-1, 1]) == False
    assert grid_2D.is_out_of_bound(bound_z = [-1, 1], bound_x = [-1, 1]) == True
    assert grid_2D.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2]) == False
    assert grid_2D.is_out_of_bound(bound_z = [-1, 1], bound_y = [-2, 2]) == True
    assert grid_2D.is_out_of_bound(bound_z = [-1, 1], bound_y = [-3, 3]) == False
    assert grid_2D.is_out_of_bound(bound_z = [-1, 1], bound_x = [-1, 1], bound_y = [-2, 2]) == True
    assert grid_2D.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2], bound_y = [-3, 3]) == False

    assert grid_3D120.is_out_of_bound(bound_z = [-10, -5]) == True
    assert grid_3D120.is_out_of_bound(bound_z = [-1, 1]) == False
    assert grid_3D120.is_out_of_bound(bound_z = [-1, 1], bound_x = [-1, 1]) == True
    assert grid_3D120.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2]) == False
    assert grid_3D120.is_out_of_bound(bound_z = [-1, 1], bound_y = [-2, 2]) == True
    assert grid_3D120.is_out_of_bound(bound_z = [-1, 1], bound_y = [-3, 3]) == False
    assert grid_3D120.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2], bound_y = [-2, 2]) == True
    assert grid_3D120.is_out_of_bound(bound_z = [-1, 1], bound_x = [-2, 2], bound_y = [-3, 3]) == False

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
    start_grid = Grid(start["x"], start["y"], start["z"])

    data = scenario["data"]
    index_obstacle = 0
    obstacle_grid = Grid(data["x"][index_obstacle], data["y"][index_obstacle], data["z"][index_obstacle])
    test_grid = Grid(5, 9, 2)
    assert start_grid != obstacle_grid
    assert start_grid == test_grid
