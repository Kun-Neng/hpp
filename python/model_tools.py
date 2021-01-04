import numpy as np
# from math import sqrt

class ModelTools:
    def __init__(self, scenario):
        self.scenario = scenario
        self.dimension = scenario["dimension"]
        self.data = scenario["data"]
        self.obstacle_array = scenario["obstacle_array"]
        self.waypoint = scenario["waypoint"]
        self.boundary = scenario["boundary"]
    
    def has_collision(self, obj_a, obj_b):
        return obj_a == obj_b
    
    def is_boundary_available(self, zFloor, zStart, zCeil):
        if zFloor and zStart <= zFloor:
            print("zStart <= zFloor")
            return False
        if zCeil and zStart >= zCeil:
            print("zStart >= zCeil")
            return False
        return zFloor + 1 < zCeil
    
    def create_initial_Q(self):
        x = int(self.dimension["x"])
        y = int(self.dimension["y"])
        z = int(self.dimension["z"])
        print("Scenario dimension: {}, {}, {}".format(x, y, z))
        
        start = self.waypoint["start"]
        stop = self.waypoint["stop"]

        xStart = int(start["x"])
        yStart = int(start["y"])
        zStart = int(start["z"])
        xStop = int(stop["x"])
        yStop = int(stop["y"])
        zStop = int(stop["z"])

        start_array = np.array([xStart, yStart, zStart])
        stop_array = np.array([xStop, yStop, zStop])
        
        zCeil = int(self.boundary["zCeil"])
        zFloor = int(self.boundary["zFloor"])
        print("zCeil: {}, zFloor: {}".format(zCeil, zFloor))

        # print(self.obstacle_array)
        # print(len(self.obstacle_array))

        Q = dict()
        
        if z == 0:
            print("two dimension")
        else:
            if not self.is_boundary_available(zFloor, zStart, zCeil):
                return { "initQ": Q, "zCeil": zCeil, "zFloor": zFloor }
            
            if int(self.data["size"]) >= 1:  # 1000
                print("Deal with 3D large scenario creation.")
                for _, obstacle in enumerate(self.obstacle_array):
                    # print(obstacle)
                    if self.has_collision(start, obstacle):
                        print("the start point is located on obstacle")
                        return { "initQ": Q, "zCeil": zCeil, "zFloor": zFloor }
                
                key = ",".join([str(xStart), str(yStart), str(zStart)])
                # start_str_array = np.array(map(str, start_array))
                # print(start_str_array)
                # key = ",".join(start_str_array)
                # print(key)

                # leftX = xStop - xStart
                # leftY = yStop - yStart
                # leftZ = zStop - zStart
                # f_value = sqrt(leftX**2 + leftY**2 + leftZ**2)

                left = np.subtract(stop_array, start_array)
                f_value = np.sqrt(left[0]**2 + left[1]**2 + left[2]**2)

                Q[key] = {
                    "row": xStart,
                    "col": yStart,
                    "z": zStart,
                    "prev": None,
                    "dist": 0,
                    # "f": abs(stop["x"] - xStart) + abs(stop["y"] - yStart) + abs(stop["z"] - zStart)
                    "f": f_value
                }

                # print(len(Q))
                # print(Q)

                return { "initQ": Q, "zCeil": zCeil, "zFloor": zFloor }
            else:
                print("Deal with 3D small scenario creation.")
