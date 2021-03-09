import json
from pyhpp.a_star import AStar

if __name__ == "__main__":
    with open("tests/test_scenario_3d.json") as file:
        scenario = json.load(file)
        file.close()

    a_star = AStar(scenario)
    result = a_star.calculate_path()

    # for [key, value] in result.items():
    #     print(key, value)

    visited_Q = result["visitedQ"]
    # [print(item) for item in visited_Q.items()]

    final_Q = result["finalQ"]
    # [print(item) for item in final_Q.items()]

    path = result["path"]
    print(f"x: {path['x']}")
    print(f"y: {path['y']}")
    print(f"z: {path['z']}")
