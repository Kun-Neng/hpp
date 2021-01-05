from model import create_obstacle_array
from model import Model
from a_star import AStar

scenario = {
    "dimension": {"x": 10, "y": 10, "z": 10},
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

if __name__ == "__main__":
    model = Model(scenario)
    init_Q = model.create_initial_Q()
    # print(len(init_Q))
    # print(init_Q)

    obstacle_array = create_obstacle_array(scenario["data"])
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
