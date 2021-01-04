import unittest

from model_tools import ModelTools
from a_star import AStar

scenario = {
    "dimension": { "x": 10, "y": 10, "z": 10 },
    # "data": {},
    # "data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "waypoint": {
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": False
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
}

def createObstacleArray(data):
    # print(len(data))
    if len(data) == 0 or data["size"] == 0:
        return
    
    xArray = data["x"]
    yArray = data["y"]
    zArray = data["z"]
    size = int(data["size"])

    obstacle_array = [{"x": xArray[i], "y": yArray[i], "z": zArray[i]} for i in range(size)]

    return obstacle_array

def createPathFromFinalQ(finalQ, scenario):
    scenario_z = int(scenario["dimension"]["z"])

    stop = scenario["waypoint"]["stop"]
    stopPosition = str(stop["x"]) + "," + str(stop["y"]) if scenario_z == 0 else str(stop["x"]) + "," + str(stop["y"]) + "," + str(stop["z"])
    finalObject = finalQ[stopPosition]

    newXArray = [finalObject["row"]]
    newYArray = [finalObject["col"]]
    newZArray = [0] if scenario_z == 0 else [finalObject["z"]]

    while finalObject["prev"] is not None:
        finalObject = finalQ[finalObject["prev"]]

        currentRow = finalObject["row"]
        currentCol = finalObject["col"]
        currentZ = 0 if scenario_z == 0 else finalObject["z"]

        # newXArray.push(currentRow)
        # newYArray.push(currentCol)
        # newZArray.push(currentZ)
        newXArray.append(currentRow)
        newYArray.append(currentCol)
        newZArray.append(currentZ)
    
    return {
        "x": newXArray,
        "y": newYArray,
        "z": newZArray
    }

class AlgorithmTest(unittest.TestCase):
    def setUp(self):
        obstacle_array = createObstacleArray(scenario["data"])
        scenario["obstacle_array"] = obstacle_array
        self.model = ModelTools(scenario)

    def test_object_collision(self):
        start_point = scenario["waypoint"]["start"]
        obstacle = { "x": 4, "y": 6, "z": 2 }
        self.assertFalse(self.model.has_collision(start_point, obstacle))
    
    def test_boundary(self):
        zStart = int(scenario["waypoint"]["start"]["z"])
        zCeil = int(scenario["boundary"]["zCeil"])
        zFloor = int(scenario["boundary"]["zFloor"])
        self.assertTrue(self.model.is_boundary_available(zFloor, zStart, zCeil))

    # def test_initQ(self):
    #     init_Q = self.model.create_initial_Q()
    #     self.assertEqual(len(init_Q), 3)

if __name__ == "__main__":
    # unittest.main()  # repl process died unexpectedly
    unittest.main(verbosity=2, exit=False)

    obstacle_array = createObstacleArray(scenario["data"])
    scenario["obstacle_array"] = obstacle_array

    model = ModelTools(scenario)
    init_Q = model.create_initial_Q()
    # print(len(init_Q))
    # print(init_Q)

    initQ = init_Q["initQ"]
    zCeil = init_Q["zCeil"]
    zFloor = init_Q["zFloor"]
    a_star = AStar(scenario, initQ, zCeil, zFloor)
    final_Q = a_star.calculatePath()
    finalQ = final_Q["finalQ"]
    # print(finalQ)

    # for [key, value] in finalQ.items():
    #     print(key, value)

    path = createPathFromFinalQ(finalQ, scenario)
    print("x:", path["x"])
    print("y:", path["y"])
    print("z:", path["z"])
