import unittest

from model import create_obstacle_array, has_collision, is_boundary_available
from model import Model
from a_star import AStar

scenario = {
    "dimension": {"x": 10, "y": 10, "z": 10},
    # "data": {},
    # "data": {"size": 0, "x": [], "y": [], "z": []},
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


class AlgorithmTest(unittest.TestCase):
    def setUp(self):
        self.model = Model(scenario)
        init_Q = self.model.create_initial_Q()
        self.assertEqual(len(init_Q), 3)

        obstacle_array = create_obstacle_array(scenario["data"])
        self.num_obstacles = len(obstacle_array)
        a_star = AStar(init_Q, scenario, obstacle_array)
        final_Q = a_star.calculate_path()
        self.path = final_Q["path"]

    def test_numpy(self):
        import numpy as np
        test_np_str = np.array(['1', '2', '3'])
        test_np_int = test_np_str.astype(np.int)
        # print(test_np_int)
        self.assertEqual(len(test_np_int), 3)

    def test_object_collision(self):
        start_point = scenario["waypoint"]["start"]
        obstacle = {"x": 4, "y": 6, "z": 2}
        self.assertFalse(has_collision(start_point, obstacle))

    def test_boundary(self):
        zStart = int(scenario["waypoint"]["start"]["z"])
        zCeil = int(scenario["boundary"]["zCeil"])
        zFloor = int(scenario["boundary"]["zFloor"])
        self.assertTrue(is_boundary_available(zFloor, zStart, zCeil))


if __name__ == "__main__":
    # unittest.main()  # repl process died unexpectedly
    unittest.main(verbosity=2, exit=False)
