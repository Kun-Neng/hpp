import os
import json
from pyhpp.a_star import AStar

scenario_json = os.getcwd() + '\\python\\tests\\test_scenario_3d.json'
print(scenario_json)

if __name__ == "__main__":
    with open(scenario_json) as file:
        scenario = json.load(file)
        file.close()

    a_star = AStar(scenario)
    result = a_star.calculate_path()

    # for [key, value] in result.items():
    #     print(key, value)

    visited_Q = result["visited_Q"]
    # [print(item) for item in visited_Q.items()]

    final_Q = result["final_Q"]
    # [print(item) for item in final_Q.items()]

    message = result["message"]
    elapsed_time = result["elapsed_ms"]
    print(f"message: {message}")
    print(f"elapsed_ms: {elapsed_time} ms")

    path = result["path"]
    print(f"x: {path['x']}")
    print(f"y: {path['y']}")
    print(f"z: {path['z']}")
