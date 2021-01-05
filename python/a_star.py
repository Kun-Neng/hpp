from math import inf, sqrt


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
        self.dimension_z = int(scenario["dimension"]["z"])
        self.obstacle_array = obstacle_array
        self.num_obstacles = len(self.obstacle_array)

        self.waypoint = scenario["waypoint"]
        start = self.waypoint["start"]
        startPosition = str(start["x"]) + "," + str(start["y"]) if self.dimension_z == 0 \
            else str(start["x"]) + "," + str(start["y"]) + "," + str(start["z"])
        self.openSet = dict()
        self.openSet[startPosition] = self.Q.get(startPosition)

        self.allowDiagonal = bool(self.waypoint["allowDiagonal"])

    def is_out_of_bound(self, neighbor_row, neighbor_col, neighbor_z):
        return neighbor_row < 0 or neighbor_col < 0 or neighbor_z <= self.z_floor or neighbor_z >= self.z_ceil

    def calculate_path(self):
        stop = self.waypoint["stop"]
        x_stop = int(stop["x"])
        y_stop = int(stop["y"])
        z_stop = int(stop["z"])

        finalQ = dict()
        visitedQ = dict()

        if self.dimension_z == 0:
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

                if currentObj["row"] == x_stop and currentObj["col"] == y_stop and currentObj["z"] == z_stop:
                    print("Arrival!")
                    break

                current_row = int(objKey.split(',')[0])
                current_col = int(objKey.split(',')[1])
                current_z = int(objKey.split(',')[2])
                # print(str(current_row) + ',' + str(current_col) + ',' + str(current_z))

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
                                # print(str(shiftRow) + ' ' + str(shiftCol))
                                neighbor_row = current_row + shiftRow
                                neighbor_col = current_col + shiftCol
                                neighbor_z = current_z + shiftZ
                                neighborPosition = str(neighbor_row) + "," + str(neighbor_col) + "," + str(neighbor_z)

                                # Prevent to search the point out of bound
                                if self.is_out_of_bound(neighbor_row, neighbor_col, neighbor_z):
                                    continue

                                # Fast search
                                isObstacleFound = False
                                for index in range(self.num_obstacles):
                                    obstacle = self.obstacle_array[index]
                                    # print(obstacle)
                                    if (obstacle["x"] == neighbor_row) and (obstacle["y"] == neighbor_col) and (
                                            obstacle["z"] == neighbor_z):
                                        # Find out an obstacle on the point
                                        isObstacleFound = True
                                        break

                                if isObstacleFound:
                                    continue

                                # has_key was removed in Python 3
                                # https://docs.python.org/3.0/whatsnew/3.0.html#builtins
                                # print(finalQ.has_key(neighborPosition))
                                if neighborPosition in finalQ:
                                    continue

                                neighbor = visitedQ.get(neighborPosition)
                                if neighbor is None:
                                    neighbor = {
                                        "row": neighbor_row,
                                        "col": neighbor_col,
                                        "z": neighbor_z,
                                        "prev": None,
                                        "dist": inf,
                                        "f": inf
                                    }
                                    visitedQ[neighborPosition] = neighbor

                                dist = sqrt(shiftRow ** 2 + shiftCol ** 2 + shiftZ ** 2)
                                alt = currentObj["dist"] + dist
                                # print('compare ' + str(alt) + ' to ' + neighbor["dist"])
                                if neighborPosition not in self.openSet:
                                    self.openSet[neighborPosition] = neighbor

                                if alt < neighbor["dist"]:
                                    # print('update neighbor object dist: ' + alt)
                                    neighbor["dist"] = alt
                                    leftX = x_stop - neighbor["row"]
                                    leftY = y_stop - neighbor["col"]
                                    leftZ = z_stop - neighbor["z"]
                                    # neighbor["f"] = alt + abs(leftX) + abs(leftY) + abs(leftZ)
                                    neighbor["f"] = alt + sqrt(leftX ** 2 + leftY ** 2 + leftZ ** 2)
                                    neighbor["prev"] = str(current_row) + "," + str(current_col) + "," + str(current_z)
                                    self.openSet[neighborPosition] = neighbor

                size = len(self.openSet)

            return {
                "visitedQ": visitedQ,
                "finalQ": finalQ,
                "path": create_path_from_final_Q(finalQ, self.scenario)
            }
