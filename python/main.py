import json
from pyhpp.a_star import AStar

if __name__ == "__main__":
    with open("python/tests/test_scenario_2d.json") as file:
        scenario = json.load(file)
        file.close()

    a_star = AStar(scenario)
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
