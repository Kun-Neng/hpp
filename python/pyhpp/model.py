import time
from math import inf
from pyhpp.node import Node


class Model:
    def __init__(self, dimension, obstacle_array, waypoint, debug_mode=False):
        self.dimension = dimension
        self.is_2d = Model.is_two_dimensional(self.dimension)

        self.obstacle_array = obstacle_array

        start = waypoint["start"]
        stop = waypoint["stop"]
        self.start_node = Node(start["x"], start["y"]) if self.is_2d else Node(start["x"], start["y"], start["z"])
        self.start_node.set_as_start_node()
        self.stop_node = Node(stop["x"], stop["y"]) if self.is_2d else Node(stop["x"], stop["y"], stop["z"])
        self.dist = self.start_node.distance_to(self.stop_node)

        self.init_Q = dict()

        self.debug_mode = debug_mode

    @staticmethod
    def is_two_dimensional(dimension):
        if "z" not in dimension or int(dimension["z"]) <= 0:
            return True
        return False

    @staticmethod
    def create_obstacle_array(data = None):
        if data is None or len(data) == 0 or int(data["size"]) == 0:
            return []

        size = int(data["size"])

        x_array = data["x"]
        y_array = data["y"]

        if "z" not in data:
            return [Node(x_array[i], y_array[i]) for i in range(size)]
        else:
            z_array = data["z"]
            return [Node(x_array[i], y_array[i], z_array[i]) for i in range(size)]

    @staticmethod
    def nodes_on_obstacles(array, nodes):
        for _, restricted_node in enumerate(array):
            for node in nodes:
                if node == restricted_node:
                    print("the point is located on restricted region")
                    return True
        return False

    @staticmethod
    def is_boundary_available(lower_bound, value, upper_bound):
        lower_bound = -inf if lower_bound is None else lower_bound
        upper_bound = inf if upper_bound is None else upper_bound

        if value <= lower_bound:
            print("value <= lower_bound")
            return False

        if value >= upper_bound:
            print("value >= upper_bound")
            return False

        return lower_bound + 1 < upper_bound

    def create_initial_Q(self, is_fast=True):
        x = int(self.dimension["x"])
        y = int(self.dimension["y"])

        calculate_start_time = time.time()
        
        if self.is_2d:
            [self.update_init_Q(row, col, None) for row in range(x) for col in range(y)
                if Node(row, col) not in self.obstacle_array]
        else:
            z = int(self.dimension["z"])

            if is_fast:
                # f_value = abs(self.left_x) + abs(self.left_y) + abs(self.left_z)  # option 1
                f_value = self.dist  # option 2
                self.start_node.f = f_value
                self.init_Q[str(self.start_node)] = self.start_node
            else:
                [self.update_init_Q(row, col, iz) for row in range(x) for col in range(y) for iz in range(z)
                    if Node(row, col, iz) not in self.obstacle_array]

        calculate_end_time = time.time()
        if self.debug_mode is True:
            print(f'create_initial_Q time: {1000.0 * (calculate_end_time - calculate_start_time)} ms')
        
        return self.init_Q
    
    def update_init_Q(self, row, col, z = None):
        cell_node = Node(row, col, z)

        if cell_node == self.start_node:
            cell_node.dist = 0
            cell_node.f = cell_node.dist + self.dist

        self.init_Q[str(cell_node)] = cell_node
