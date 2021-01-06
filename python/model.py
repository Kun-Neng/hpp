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
    if z_floor and z_start <= z_floor:
        print("z_start <= z_floor")
        return False

    if z_ceil and z_start >= z_ceil:
        print("z_start >= z_ceil")
        return False

    return z_floor + 1 < z_ceil


class Model:
    def __init__(self, scenario):
        self.dimension = scenario["dimension"]
        self.is_2d = True if int(scenario["dimension"]["z"]) == 0 else False

        self.data = scenario["data"]
        self.obstacle_array = create_obstacle_array(self.data)

        self.waypoint = scenario["waypoint"]
        self.boundary = scenario["boundary"]

    def create_initial_Q(self):
        x = int(self.dimension["x"])
        y = int(self.dimension["y"])
        z = int(self.dimension["z"])
        print("Scenario dimension: {}, {}, {}".format(x, y, z))

        start = self.waypoint["start"]
        stop = self.waypoint["stop"]
        start_grid = Grid(start["x"], start["y"], start["z"], self.is_2d)
        stop_grid = Grid(stop["x"], stop["y"], stop["z"], self.is_2d)

        z_ceil = int(self.boundary["zCeil"])
        z_floor = int(self.boundary["zFloor"])
        print("z_ceil: {}, z_floor: {}".format(z_ceil, z_floor))

        # print(self.obstacle_array)
        # print(len(self.obstacle_array))

        init_Q = dict()

        if z == 0:
            for row in range(x):
                for col in range(y):
                    for _, obstacle in enumerate(self.obstacle_array):
                        if has_collision({"x": row, "y": col}, obstacle):
                            continue

                    cell = {
                        "row": row,
                        "col": col,
                        "prev": None
                    }

                    cell_grid = Grid(row, col)
                    if cell_grid == start_grid:
                        cell["dist"] = 0
                        cell["f"] = cell["dist"] + abs(stop_grid.x - start_grid.x) + abs(stop_grid.y - start_grid.y)
                    else:
                        cell["dist"] = inf
                        cell["f"] = inf

                    init_Q[str(cell_grid)] = cell

            return {"initQ": init_Q, "zCeil": z_ceil, "zFloor": z_floor}
        else:
            if not is_boundary_available(z_floor, start_grid.z, z_ceil):
                return {"initQ": init_Q, "zCeil": z_ceil, "zFloor": z_floor}

            if int(self.data["size"]) >= 1:  # 1000
                print("Deal with 3D large scenario creation.")
                for _, obstacle in enumerate(self.obstacle_array):
                    # print(obstacle)
                    if has_collision(start, obstacle):
                        print("the start point is located on obstacle")
                        return {"initQ": init_Q, "zCeil": z_ceil, "zFloor": z_floor}

                left_x = stop_grid.x - start_grid.x
                left_y = stop_grid.y - start_grid.y
                left_z = stop_grid.z - start_grid.z
                # f_value = abs(left_x) + abs(left_y) + abs(left_z)  # option 1
                from math import sqrt
                f_value = sqrt(left_x**2 + left_y**2 + left_z**2)  # option 2

                init_Q[str(start_grid)] = {
                    "row": start_grid.x,
                    "col": start_grid.y,
                    "z": start_grid.z,
                    "prev": None,
                    "dist": 0,
                    "f": f_value
                }

                # print(len(init_Q))
                # print(init_Q)

                return {"initQ": init_Q, "zCeil": z_ceil, "zFloor": z_floor}
            else:
                print("Deal with 3D small scenario creation.")
