from math import inf
from grid import Grid


def create_obstacle_array(data):
    # print(len(data))
    if len(data) == 0 or int(data["size"]) == 0:
        return

    x_array = data["x"]
    y_array = data["y"]
    z_array = data["z"]
    size = int(data["size"])

    return [{"x": x_array[i], "y": y_array[i], "z": z_array[i]} for i in range(size)]


def has_collision(obj_a, obj_b):
    return obj_a == obj_b


def is_boundary_available(z_floor, z_start, z_ceil):
    z_floor = -inf if z_floor is None else z_floor
    z_ceil = inf if z_ceil is None else z_ceil

    if z_start <= z_floor:
        print("z_start <= z_floor")
        return False

    if z_start >= z_ceil:
        print("z_start >= z_ceil")
        return False

    return z_floor + 1 < z_ceil


class Model:
    def __init__(self, scenario):
        self.dimension = scenario["dimension"]
        self.is_2d = True if int(scenario["dimension"]["z"]) == 0 else False

        self.data = scenario["data"]
        self.obstacle_array = create_obstacle_array(self.data)

        waypoint = scenario["waypoint"]
        start = waypoint["start"]
        stop = waypoint["stop"]
        self.start_grid = Grid(start["x"], start["y"], start["z"], self.is_2d)
        self.stop_grid = Grid(stop["x"], stop["y"], stop["z"], self.is_2d)
        self.dist_x = self.stop_grid.x - self.start_grid.x
        self.dist_y = self.stop_grid.y - self.start_grid.y
        self.dist_z = self.stop_grid.z - self.start_grid.z

        self.boundary = scenario["boundary"] if "boundary" in scenario else None
        if not self.is_2d:
            self.z_ceil = int(self.boundary["zCeil"]) if (self.boundary and "zCeil" in self.boundary) else None
            self.z_floor = int(self.boundary["zFloor"]) if (self.boundary and "zFloor" in self.boundary) else None
            print("z_ceil: {}, z_floor: {}".format(self.z_ceil, self.z_floor))

        self.init_Q = dict()

    def update_init_Q(self, row, col, z=None, obstacle=None):
        cell_grid = None
        cell_obj = {
            "row": row,
            "col": col,
            "prev": None
        }

        if z is None:
            if has_collision({"x": row, "y": col}, obstacle):
                return

            cell_grid = Grid(row, col)
            if cell_grid == self.start_grid:
                cell_obj["dist"] = 0
                cell_obj["f"] = cell_obj["dist"] + abs(self.dist_x) + abs(self.dist_y)
            else:
                cell_obj["dist"] = inf
                cell_obj["f"] = inf

        self.init_Q[str(cell_grid)] = cell_obj

    def create_initial_Q(self):
        x = int(self.dimension["x"])
        y = int(self.dimension["y"])
        z = int(self.dimension["z"])
        print("Scenario dimension: {}, {}, {}".format(x, y, z))

        # print(self.obstacle_array)
        # print(len(self.obstacle_array))

        if z == 0:
            # for row in range(x):
            #     for col in range(y):
            #         for _, obstacle in enumerate(self.obstacle_array):
            #             if has_collision({"x": row, "y": col}, obstacle):
            #                 continue
            #
            #         cell = {
            #             "row": row,
            #             "col": col,
            #             "prev": None
            #         }
            #
            #         cell_grid = Grid(row, col)
            #         if cell_grid == start_grid:
            #             cell["dist"] = 0
            #             cell["f"] = cell["dist"] + abs(stop_grid.x - start_grid.x) + abs(stop_grid.y - start_grid.y)
            #         else:
            #             cell["dist"] = inf
            #             cell["f"] = inf
            #
            #         init_Q[str(cell_grid)] = cell

            [self.update_init_Q(r, c, None, obs) for r in range(x) for c in range(y) for obs in self.obstacle_array]

            return {"initQ": self.init_Q, "zCeil": None, "zFloor": None}
        else:
            if not is_boundary_available(self.z_floor, self.start_grid.z, self.z_ceil):
                return {"initQ": self.init_Q, "zCeil": self.z_ceil, "zFloor": self.z_floor}

            threshold = 1  # 1000
            if int(self.data["size"]) >= threshold:
                print("Deal with 3D large scenario creation.")
                for _, obs in enumerate(self.obstacle_array):
                    # print(obs)
                    if has_collision({"x": self.start_grid.x, "y": self.start_grid.y, "z": self.start_grid.z}, obs):
                        print("the start point is located on obstacle")
                        return {"initQ": self.init_Q, "zCeil": self.z_ceil, "zFloor": self.z_floor}

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

                # print(len(init_Q))
                # print(init_Q)

                return {"initQ": self.init_Q, "zCeil": self.z_ceil, "zFloor": self.z_floor}
            else:
                print("Deal with 3D small scenario creation.")
