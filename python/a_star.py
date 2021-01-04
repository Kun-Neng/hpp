from math import inf, sqrt

class AStar:
    def __init__(self, scenario, Q, zCeil = inf, zFloor = 0):
        self.scenario = scenario
        self.dimension_z = int(scenario["dimension"]["z"])
        self.obstacle_array = scenario["obstacle_array"]
        self.num_obstacles = scenario["data"]["size"]
        self.waypoint = scenario["waypoint"]
        self.Q = Q
        self.zCeil = zCeil
        self.zFloor = zFloor
    
    def calculatePath(self):
        start = self.waypoint["start"]
        startPosition = str(start["x"]) + "," + str(start["y"]) if self.dimension_z == 0 else str(start["x"]) + "," + str(start["y"]) + "," + str(start["z"])
        stop = self.waypoint["stop"]
        destRow = stop["x"]
        destCol = stop["y"]
        destZ = stop["z"]
        allowDiagonal = bool(self.waypoint["allowDiagonal"])

        openSet = dict()
        finalQ = dict()
        visitedQ = dict()

        if self.dimension_z == 0:
            print("A* Path Finding (2D)")
        else:
            print("A* Path Finding (3D)")
            openSet[startPosition] = self.Q.get(startPosition)
            size = len(openSet)
            while size > 0:
                objKey = None
                currentObj = None
                minF = inf
                for [key, obj] in openSet.items():
                    # print(key + ':' + str(obj["f"]))
                    if obj["f"] < minF:
                        objKey = key
                        currentObj = obj
                        minF = obj["f"]
                
                finalQ[objKey] = currentObj
                # openSet.delete(objKey)
                del openSet[objKey]

                if currentObj["row"] == destRow and currentObj["col"] == destCol and currentObj["z"] == destZ:
                    print("Arrival!")
                    break
                
                currentRow = int(objKey.split(',')[0])
                currentCol = int(objKey.split(',')[1])
                currentZ = int(objKey.split(',')[2])
                # print(str(currentRow) + ',' + str(currentCol) + ',' + str(currentZ))

                shift_grid = [-1, 0, 1]
                for shiftRow in shift_grid:
                    for shiftCol in shift_grid:
                        for shiftZ in shift_grid:
                            # 不允許斜走
                            isNotDiagonal = (shiftRow == 0 or shiftCol == 0) and (shiftRow != shiftCol)
                            # 允許斜走
                            isDiagonal = not (shiftRow == 0 and shiftCol == 0 and shiftZ == 0)

                            isAllowed = isDiagonal if allowDiagonal else isNotDiagonal
                            if isAllowed:
                                # print(str(shiftRow) + ' ' + str(shiftCol))
                                neighboringRow = currentRow + shiftRow
                                neighboringCol = currentCol + shiftCol
                                neighboringZ = currentZ + shiftZ
                                neighborPosition = str(neighboringRow) + "," + str(neighboringCol) + "," + str(neighboringZ)

                                # Prevent to search the point out of bound
                                if neighboringRow < 0 or neighboringCol < 0 or neighboringZ <= self.zFloor or neighboringZ >= self.zCeil:
                                    continue
                                
                                # Fast search
                                isObstacleFound = False
                                for index in range(self.num_obstacles):
                                    obstacle = self.obstacle_array[index]
                                    # print(obstacle)
                                    if (obstacle["x"] == neighboringRow) and (obstacle["y"] == neighboringCol) and (obstacle["z"] == neighboringZ):
                                        # Find out an obstacle on the point
                                        isObstacleFound = True
                                
                                if isObstacleFound:
                                    break
                                
                                # has_key was removed in Python 3
                                # https://docs.python.org/3.0/whatsnew/3.0.html#builtins
                                # print(finalQ.has_key(neighborPosition))
                                if neighborPosition not in finalQ:
                                    neighborObj = visitedQ.get(neighborPosition)
                                    if neighborObj is None:
                                        neighborObj = {
                                            "row": neighboringRow,
                                            "col": neighboringCol,
                                            "z": neighboringZ,
                                            "prev": None,
                                            "dist": inf,
                                            "f": inf
                                        }
                                        visitedQ[neighborPosition] = neighborObj
                                    
                                    dist = sqrt(shiftRow**2 + shiftCol**2 + shiftZ**2)
                                    alt = currentObj["dist"] + dist
                                    # print('compare ' + str(alt) + ' to ' + neighborObj["dist"])
                                    if neighborPosition not in openSet:
                                        openSet[neighborPosition] = neighborObj
                                    
                                    if alt < neighborObj["dist"]:
                                        # print('update neighbor object dist: ' + alt)
                                        neighborObj["dist"] = alt
                                        # neighborObj["f"] = alt + abs(destRow - neighborObj["row"]) + abs(destCol - neighborObj["col"]) + abs(destZ - neighborObj["z"])
                                        leftX = destRow - neighborObj["row"]
                                        leftY = destCol - neighborObj["col"]
                                        leftZ = destZ - neighborObj["z"]
                                        neighborObj["f"] = alt + sqrt(leftX**2 + leftY**2 + leftZ**2)
                                        neighborObj["prev"] = str(currentRow) + "," + str(currentCol) + "," + str(currentZ)
                                        openSet[neighborPosition] = neighborObj
                
                size = len(openSet)
            
            return {
                "visitedQ": visitedQ,
                "finalQ": finalQ
            }
