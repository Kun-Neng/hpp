from math import inf, sqrt
from grid import Grid
from model import Model


class AStar:
    def __init__(self, scenario):
        self.is_2d = True if int(scenario["dimension"]["z"]) <= 0 else False

        init_Q = AStar.create_init_Q(scenario)
        # print(init_Q)
        # print(len(init_Q))
        # print(len(init_Q["initQ"]))
        self.Q = init_Q["initQ"]
        self.z_ceil = inf if init_Q["zCeil"] is None else int(init_Q["zCeil"])
        self.z_floor = -inf if init_Q["zFloor"] is None else int(init_Q["zFloor"])

        self.obstacle_array = Model.create_obstacle_array(scenario["data"], self.is_2d)
        self.num_obstacles = len(self.obstacle_array)

        self.waypoint = scenario["waypoint"]
        start = self.waypoint["start"]
        start_grid = Grid(start["x"], start["y"], start["z"], self.is_2d)
        stop = self.waypoint["stop"]
        self.stop_grid = Grid(stop["x"], stop["y"], stop["z"], self.is_2d)
        self.open_set = dict()
        self.open_set[str(start_grid)] = self.Q.get(str(start_grid))

        self.allowDiagonal = bool(self.waypoint["allowDiagonal"]) if "allowDiagonal" in self.waypoint else False

    @staticmethod
    def create_init_Q(scenario):
        model = Model(scenario)
        threshold = 1  # 1000
        return model.create_initial_Q(threshold)

    @staticmethod
    def find_the_min_f(hashmap):
        objKey = None
        objValue = None
        minF = inf
        for [key, obj] in hashmap.items():
            # print(key + ':' + str(obj["f"]))
            if obj["f"] < minF:
                objKey = key
                objValue = obj
                minF = obj["f"]

        return {
            "key": objKey,
            "value": objValue
        }

    def create_path_from_final_Q(self, finalQ):
        finalObject = finalQ[str(self.stop_grid)]

        newXArray = [int(finalObject["row"])]
        newYArray = [int(finalObject["col"])]
        newZArray = [0] if self.is_2d else [finalObject["z"]]

        while finalObject["prev"] is not None:
            finalObject = finalQ[finalObject["prev"]]

            current_row = int(finalObject["row"])
            current_col = int(finalObject["col"])
            current_z = 0 if self.is_2d else finalObject["z"]

            newXArray.append(current_row)
            newYArray.append(current_col)
            newZArray.append(current_z)

        return {
            "x": newXArray,
            "y": newYArray,
            "z": newZArray
        }

    def calculate_path(self):
        print("A* Path Finding (2D)") if self.is_2d else print("A* Path Finding (3D)")
        finalQ = dict()
        visitedQ = dict()

        size = len(self.open_set)
        while size > 0:
            obj = AStar.find_the_min_f(self.open_set)
            objKey = obj["key"]
            currentObj = obj["value"]
            finalQ[objKey] = currentObj
            del self.open_set[objKey]

            if self.is_2d:
                current_grid = Grid(currentObj["row"], currentObj["col"])
            else:
                current_grid = Grid(currentObj["row"], currentObj["col"], currentObj["z"], self.is_2d)
            if current_grid == self.stop_grid:
                print("Arrival!")
                break

            shift_grid = [-1, 0, 1]
            for shift_row in shift_grid:
                for shift_col in shift_grid:
                    if self.is_2d:
                        # 不允許斜走
                        isNotDiagonal = (shift_row == 0 or shift_col == 0) and (shift_row != shift_col)
                        # 允許斜走
                        isDiagonal = not (shift_row == 0 and shift_col == 0)

                        isAllowed = isDiagonal if self.allowDiagonal else isNotDiagonal
                        if isAllowed:
                            neighbor_grid = current_grid.shift(shift_row, shift_col)
                            neighbor = self.Q.get(str(neighbor_grid))

                            if neighbor is not None and str(neighbor_grid) not in finalQ:
                                visitedQ[str(neighbor_grid)] = neighbor

                                if str(neighbor_grid) not in self.open_set:
                                    self.open_set[str(neighbor_grid)] = neighbor

                                dist = sqrt(shift_row ** 2 + shift_col ** 2)
                                alt = currentObj["dist"] + dist
                                # print('compare ' + str(alt) + ' to ' + neighbor["dist"])
                                if alt < neighbor["dist"]:
                                    # print('update neighbor object dist: ' + alt)
                                    neighbor["dist"] = alt
                                    dist_x = self.stop_grid.x - neighbor["row"]
                                    dist_y = self.stop_grid.y - neighbor["col"]
                                    neighbor["f"] = alt + abs(dist_x) + abs(dist_y)
                                    # neighbor["f"] = alt + sqrt(dist_x ** 2 + dist_y ** 2)
                                    neighbor["prev"] = str(current_grid)
                                    self.open_set[str(neighbor_grid)] = neighbor
                    else:
                        for shift_z in shift_grid:
                            # 不允許斜走
                            isNotDiagonal = (shift_row == 0 or shift_col == 0) and (shift_row != shift_col)
                            # 允許斜走
                            isDiagonal = not (shift_row == 0 and shift_col == 0 and shift_z == 0)

                            isAllowed = isDiagonal if self.allowDiagonal else isNotDiagonal
                            if isAllowed:
                                # print(str(shift_row) + ' ' + str(shift_col) + ' ' + str(shift_z))
                                neighbor_grid = current_grid.shift(shift_row, shift_col, shift_z)

                                if neighbor_grid.is_out_of_bound([self.z_floor, self.z_ceil]):
                                    continue

                                # Full search (time-consuming) = 2D
                                # neighbor = self.Q.get(str(neighbor_grid))
                                # if neighbor is not None and str(neighbor_grid) not in finalQ:
                                #     visitedQ[str(neighbor_grid)] = neighbor
                                #
                                #     dist = sqrt(shift_row ** 2 + shift_col ** 2 + shift_z ** 2)
                                #     alt = currentObj["dist"] + dist
                                #     # ...

                                # Fast search
                                isObstacleFound = False
                                for index in range(self.num_obstacles):
                                    obstacle_grid = self.obstacle_array[index]
                                    if obstacle_grid == neighbor_grid:
                                        # Find out an obstacle on the neighbor grid
                                        isObstacleFound = True
                                        break
                                if isObstacleFound:
                                    continue

                                # has_key was removed in Python 3
                                # https://docs.python.org/3.0/whatsnew/3.0.html#builtins
                                # print(finalQ.has_key(neighborPosition))
                                if str(neighbor_grid) in finalQ:
                                    continue

                                neighbor = visitedQ.get(str(neighbor_grid))
                                if neighbor is None:
                                    neighbor = {
                                        "row": neighbor_grid.x,
                                        "col": neighbor_grid.y,
                                        "z": neighbor_grid.z,
                                        "prev": None,
                                        "dist": inf,
                                        "f": inf
                                    }
                                    visitedQ[str(neighbor_grid)] = neighbor

                                if str(neighbor_grid) not in self.open_set:
                                    self.open_set[str(neighbor_grid)] = neighbor

                                dist = sqrt(shift_row ** 2 + shift_col ** 2 + shift_z ** 2)
                                alt = currentObj["dist"] + dist
                                # print('compare ' + str(alt) + ' to ' + neighbor["dist"])
                                if alt < neighbor["dist"]:
                                    # print('update neighbor object dist: ' + alt)
                                    neighbor["dist"] = alt
                                    dist_x = self.stop_grid.x - neighbor["row"]
                                    dist_y = self.stop_grid.y - neighbor["col"]
                                    dist_z = self.stop_grid.z - neighbor["z"]
                                    # neighbor["f"] = alt + abs(dist_x) + abs(dist_y) + abs(dist_z)
                                    neighbor["f"] = alt + sqrt(dist_x ** 2 + dist_y ** 2 + dist_z ** 2)
                                    neighbor["prev"] = str(current_grid)
                                    self.open_set[str(neighbor_grid)] = neighbor

            size = len(self.open_set)

        return {
            "visitedQ": visitedQ,
            "finalQ": finalQ,
            "path": self.create_path_from_final_Q(finalQ)
        }
