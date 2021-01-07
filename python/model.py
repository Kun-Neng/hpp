from math import inf
from grid import Grid


class Model:
    def __init__(self, dimension, obstacle_array, waypoint):
        self.dimension = dimension
        self.is_2d = True if ("z" not in dimension or int(self.dimension["z"]) <= 0) else False

        self.obstacle_array = obstacle_array
        # print(self.obstacle_array)
        # print(len(self.obstacle_array))

        start = waypoint["start"]
        stop = waypoint["stop"]
        self.start_grid = Grid(start["x"], start["y"], start["z"], self.is_2d)
        self.stop_grid = Grid(stop["x"], stop["y"], stop["z"], self.is_2d)
        self.dist_x = self.stop_grid.x - self.start_grid.x
        self.dist_y = self.stop_grid.y - self.start_grid.y
        self.dist_z = self.stop_grid.z - self.start_grid.z

        self.init_Q = dict()

    @staticmethod
    def create_obstacle_array(data, is_2d):
        # print(len(data))
        if len(data) == 0 or int(data["size"]) == 0:
            return

        size = int(data["size"])

        x_array = data["x"]
        y_array = data["y"]

        if is_2d:
            return [Grid(x_array[i], y_array[i]) for i in range(size)]
        else:
            z_array = data["z"]
            return [Grid(x_array[i], y_array[i], z_array[i], is_2d) for i in range(size)]

    @staticmethod
    def grids_on_obstacles(array, grids):
        for _, restricted_grid in enumerate(array):
            for grid in grids:
                if grid == restricted_grid:
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
            print("value >= lower_bound")
            return False

        return lower_bound + 1 < upper_bound

    def update_init_Q(self, row, col, z, obstacle=None):
        cell_grid = Grid(row, col, z, self.is_2d)
        if cell_grid == obstacle:
            return None

        cell_obj = {
            "row": row,
            "col": col,
            "z": z,
            "prev": None,
            "dist": inf,
            "f": inf
        }

        if cell_grid == self.start_grid:
            cell_obj["dist"] = 0
            cell_obj["f"] = cell_obj["dist"] + abs(self.dist_x) + abs(self.dist_y) if self.is_2d \
                else cell_obj["dist"] + abs(self.dist_x) + abs(self.dist_y) + abs(self.dist_z)

        self.init_Q[str(cell_grid)] = cell_obj

    def create_initial_Q(self, is_fast=True):
        x = int(self.dimension["x"])
        y = int(self.dimension["y"])

        if self.is_2d:
            print("Scenario dimension: {}, {}".format(x, y))
            [self.update_init_Q(row, col, 0, obstacle) for row in range(x) for col in range(y)
                for obstacle in self.obstacle_array]

            return {"initQ": self.init_Q, "zCeil": None, "zFloor": None}
        else:
            z = int(self.dimension["z"])
            print("Scenario dimension: {}, {}, {}".format(x, y, z))

            if is_fast:
                # f_value = abs(self.left_x) + abs(self.left_y) + abs(self.left_z)  # option 1
                from math import sqrt
                f_value = sqrt(self.dist_x ** 2 + self.dist_y ** 2 + self.dist_z ** 2)  # option 2

                self.init_Q[str(self.start_grid)] = {
                    "row": self.start_grid.x,
                    "col": self.start_grid.y,
                    "z": self.start_grid.z,
                    "prev": None,
                    "dist": 0,
                    "f": f_value
                }
            else:
                [self.update_init_Q(row, col, iz, obstacle) for row in range(x) for col in range(y) for iz in range(z)
                    for obstacle in self.obstacle_array]

            return {"initQ": self.init_Q}
