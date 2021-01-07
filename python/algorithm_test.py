import unittest

from algorithm.grid import Grid
from algorithm.model import Model
from algorithm.a_star import AStar

scenario = {
    # "dimension": {"x": 15, "y": 15, "z": 0},  # 2D
    "dimension": {"x": 10, "y": 10, "z": 10},  # 3D
    # "data": {},
    # "data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    # "waypoint": {  # 2D
    #     "start": {"x": 12, "y": 0, "z": 0},
    #     "stop": {"x": 1, "y": 11, "z": 0},
    #     "allowDiagonal": False
    # },
    "waypoint": {  # 3D
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": False
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
}


class AlgorithmTest(unittest.TestCase):
    def setUp(self):
        self.a_star = AStar(scenario)
        dimension = scenario["dimension"]
        self.is_2d = Model.is_2d(dimension)

    def test_object_collision(self):
        start = scenario["waypoint"]["start"]
        start_grid = Grid(start["x"], start["y"], start["z"], False)

        data = scenario["data"]
        index_obstacle = 0
        obstacle_grid = Grid(data["x"][index_obstacle], data["y"][index_obstacle], data["z"][index_obstacle], False)
        test_grid = Grid(5, 9, 2, False)
        self.assertTrue(start_grid == test_grid)
    
    def test_is_2d(self):
        dimension = scenario["dimension"]
        is_2d = Model.is_2d(dimension)
        self.assertEqual(is_2d, False)

    def test_check_num_obstacles(self):
        obstacle_array = Model.create_obstacle_array(scenario["data"], self.is_2d)
        num_obstacles = len(obstacle_array)
        self.assertEqual(num_obstacles, scenario["data"]["size"])

    def test_boundary(self):
        zStart = int(scenario["waypoint"]["start"]["z"])
        zCeil = int(scenario["boundary"]["zCeil"])
        zFloor = int(scenario["boundary"]["zFloor"])
        self.assertTrue(Model.is_boundary_available(zFloor, zStart, zCeil))

    # def test_numpy(self):
    #     import numpy as np
    #     test_np_str = np.array(['1', '2', '3'])
    #     test_np_int = test_np_str.astype(np.int)
    #     # print(test_np_int)
    #     self.assertEqual(len(test_np_int), 3)

    # def test_find_the_min_f(self):
    #     from random import random
    #     open_set = dict()
    #     for i in range(10):
    #         open_set[str(i)] = {"f": random()}
    #     obj = AStar.find_the_min_f(open_set)

    def test_calculate_path(self):
        final_Q = self.a_star.calculate_path()
        path = final_Q["path"]
        self.assertEqual(len(path["x"]), 14)

    def tearDown(self):
        self.a_star = None
        self.is_2d = None


if __name__ == "__main__":
    # unittest.main()  # repl process died unexpectedly
    unittest.main(verbosity=2, exit=False)
