from model import Model
from a_star import AStar

scenario = {
    # "dimension": {"x": 15, "y": 15, "z": 0},  # 2D
    "dimension": {"x": 10, "y": 10, "z": 10},  # 3D
    # "data": {},
    # "data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    # "waypoint": {  # 2D
    #     "start": {"x": 12, "y": 0, "z": 0},
    #     "stop": {"x": 1, "y": 11, "z": 0},
    #     "allowDiagonal": False
    # },
    "waypoint": {  # 3D
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": True
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
}

if __name__ == "__main__":
    model = Model(scenario)
    threshold = 1  # 1000
    init_Q = model.create_initial_Q(threshold)
    # print(init_Q)
    # print(len(init_Q))
    # print(len(init_Q["initQ"]))

    is_2d = True if int(scenario["dimension"]["z"]) == 0 else False
    obstacle_array = Model.create_obstacle_array(scenario["data"], is_2d)
    a_star = AStar(init_Q, scenario, obstacle_array)
    final_Q = a_star.calculate_path()
    finalQ = final_Q["finalQ"]
    # print(finalQ)

    # for [key, value] in finalQ.items():
    #     print(key, value)

    # path = create_path_from_final_Q(finalQ, scenario)
    path = final_Q["path"]
    print("x:", path["x"])
    print("y:", path["y"])
    print("z:", path["z"])
