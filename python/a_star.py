from math import inf, sqrt
from grid import Grid


def create_path_from_final_Q(finalQ, scenario):
    scenario_z = int(scenario["dimension"]["z"])

    stop = scenario["waypoint"]["stop"]
    stopPosition = str(stop["x"]) + "," + str(stop["y"]) if scenario_z == 0 \
        else str(stop["x"]) + "," + str(stop["y"]) + "," + str(stop["z"])
    finalObject = finalQ[stopPosition]

    newXArray = [finalObject["row"]]
    newYArray = [finalObject["col"]]
    newZArray = [0] if scenario_z == 0 else [finalObject["z"]]

    while finalObject["prev"] is not None:
        finalObject = finalQ[finalObject["prev"]]

        current_row = finalObject["row"]
        current_col = finalObject["col"]
        current_z = 0 if scenario_z == 0 else finalObject["z"]

        # newXArray.push(current_row)
        # newYArray.push(current_col)
        # newZArray.push(current_z)
        newXArray.append(current_row)
        newYArray.append(current_col)
        newZArray.append(current_z)

    return {
        "x": newXArray,
        "y": newYArray,
        "z": newZArray
    }


class AStar:
    def __init__(self, init_Q, scenario, obstacle_array):
        self.Q = init_Q["initQ"]
        self.z_ceil = inf if init_Q["zCeil"] is None else int(init_Q["zCeil"])
        self.z_floor = 0 if init_Q["zFloor"] is None else int(init_Q["zFloor"])

        self.scenario = scenario
        self.is_2d = True if int(scenario["dimension"]["z"]) == 0 else False
        self.obstacle_array = obstacle_array
        self.num_obstacles = len(self.obstacle_array)

        self.waypoint = scenario["waypoint"]
        start = self.waypoint["start"]
        start_grid = Grid(start["x"], start["y"], start["z"], self.is_2d)
        self.openSet = dict()
        self.openSet[str(start_grid)] = self.Q.get(str(start_grid))

        self.allowDiagonal = bool(self.waypoint["allowDiagonal"])

    def calculate_path(self):
        stop = self.waypoint["stop"]
        stop_grid = Grid(stop["x"], stop["y"], stop["z"], self.is_2d)

        finalQ = dict()
        visitedQ = dict()

        if self.is_2d:
            print("A* Path Finding (2D)")
        else:
            print("A* Path Finding (3D)")
            size = len(self.openSet)
            while size > 0:
                objKey = None
                currentObj = None
                minF = inf
                for [key, obj] in self.openSet.items():
                    # print(key + ':' + str(obj["f"]))
                    if obj["f"] < minF:
                        objKey = key
                        currentObj = obj
                        minF = obj["f"]

                finalQ[objKey] = currentObj
                # openSet.delete(objKey)
                del self.openSet[objKey]

                current_grid = Grid(currentObj["row"], currentObj["col"], currentObj["z"], self.is_2d)
                if current_grid == stop_grid:
                    print("Arrival!")
                    break

                shift_grid = [-1, 0, 1]
                for shiftRow in shift_grid:
                    for shiftCol in shift_grid:
                        for shiftZ in shift_grid:
                            # 不允許斜走
                            isNotDiagonal = (shiftRow == 0 or shiftCol == 0) and (shiftRow != shiftCol)
                            # 允許斜走
                            isDiagonal = not (shiftRow == 0 and shiftCol == 0 and shiftZ == 0)

                            isAllowed = isDiagonal if self.allowDiagonal else isNotDiagonal
                            if isAllowed:
                                # print(str(shiftRow) + ' ' + str(shiftCol) + ' ' + str(shiftZ))
                                neighbor_grid = current_grid.shift(shiftRow, shiftCol, shiftZ)

                                if neighbor_grid.is_out_of_bound([self.z_floor, self.z_ceil]):
                                    continue

                                # Fast search
                                isObstacleFound = False
                                for index in range(self.num_obstacles):
                                    obstacle = self.obstacle_array[index]
                                    obstacle_grid = Grid(obstacle["x"], obstacle["y"], obstacle["z"], self.is_2d)
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

                                dist = sqrt(shiftRow ** 2 + shiftCol ** 2 + shiftZ ** 2)
                                alt = currentObj["dist"] + dist
                                # print('compare ' + str(alt) + ' to ' + neighbor["dist"])
                                if str(neighbor_grid) not in self.openSet:
                                    self.openSet[str(neighbor_grid)] = neighbor

                                if alt < neighbor["dist"]:
                                    # print('update neighbor object dist: ' + alt)
                                    neighbor["dist"] = alt
                                    leftX = stop["x"] - neighbor["row"]
                                    leftY = stop["y"] - neighbor["col"]
                                    leftZ = stop["z"] - neighbor["z"]
                                    # neighbor["f"] = alt + abs(leftX) + abs(leftY) + abs(leftZ)
                                    neighbor["f"] = alt + sqrt(leftX ** 2 + leftY ** 2 + leftZ ** 2)
                                    neighbor["prev"] = str(current_grid)
                                    self.openSet[str(neighbor_grid)] = neighbor

                size = len(self.openSet)

            return {
                "visitedQ": visitedQ,
                "finalQ": finalQ,
                "path": create_path_from_final_Q(finalQ, self.scenario)
            }
