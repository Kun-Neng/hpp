import numpy as np
from math import inf


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

        x_start = int(start["x"])
        y_start = int(start["y"])
        z_start = int(start["z"])
        x_stop = int(stop["x"])
        y_stop = int(stop["y"])
        z_stop = int(stop["z"])

        start_array = np.array([x_start, y_start, z_start])
        stop_array = np.array([x_stop, y_stop, z_stop])

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

                    if row == x_start and col == y_start:
                        cell["dist"] = 0
                        cell["f"] = cell["dist"] + abs(x_stop - x_start) + abs(y_stop - y_start)
                    else:
                        cell["dist"] = inf
                        cell["f"] = inf

                    key = str(row) + "," + str(col)
                    init_Q[key] = cell

            return {"initQ": init_Q, "zCeil": z_ceil, "zFloor": z_floor}
        else:
            if not is_boundary_available(z_floor, z_start, z_ceil):
                return {"initQ": init_Q, "zCeil": z_ceil, "zFloor": z_floor}

            if int(self.data["size"]) >= 1:  # 1000
                print("Deal with 3D large scenario creation.")
                for _, obstacle in enumerate(self.obstacle_array):
                    # print(obstacle)
                    if has_collision(start, obstacle):
                        print("the start point is located on obstacle")
                        return {"initQ": init_Q, "zCeil": z_ceil, "zFloor": z_floor}

                key = ",".join([str(x_start), str(y_start), str(z_start)])
                # start_str_array = np.array(map(str, start_array))
                # print(start_str_array)
                # key = ",".join(start_str_array)
                # print(key)

                # leftX = x_stop - x_start
                # leftY = y_stop - y_start
                # leftZ = z_stop - z_start
                # # f_value = abs(stop["x"] - x_start) + abs(stop["y"] - y_start) + abs(stop["z"] - z_start)  # option 1
                # from math import sqrt
                # f_value = sqrt(leftX**2 + leftY**2 + leftZ**2)  # option 2

                left = np.subtract(stop_array, start_array)
                f_value = np.sqrt(left[0] ** 2 + left[1] ** 2 + left[2] ** 2)

                init_Q[key] = {
                    "row": x_start,
                    "col": y_start,
                    "z": z_start,
                    "prev": None,
                    "dist": 0,
                    "f": f_value
                }

                # print(len(init_Q))
                # print(init_Q)

                return {"initQ": init_Q, "zCeil": z_ceil, "zFloor": z_floor}
            else:
                print("Deal with 3D small scenario creation.")
