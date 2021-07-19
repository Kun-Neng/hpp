import os
import json
from pyhpp.a_star import AStar


project_root_path = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
print(f'Root Path of Project: {project_root_path}')
small_3d_scenario_json = project_root_path + '\\scenarios\\small_3d_scenario.json'
print(f'========== Small 3D Scenario JSON: {small_3d_scenario_json} ==========')
medium_scenarios = [project_root_path + f'\\scenarios\\medium_3d_scenario{iScenario}.json' for iScenario in range(1, 5)]


if __name__ == "__main__":
    with open(small_3d_scenario_json) as file:
        small_3d_scenario = json.load(file)
        file.close()

    print(f'Small 3D Scenario Data Size: {small_3d_scenario["data"]["size"]}')
    
    a_star = AStar(small_3d_scenario)
    result = a_star.calculate_path()

    # for [key, value] in result.items():
    #     print(key, value)

    visited_Q = result["visited_Q"]
    # [print(item) for item in visited_Q.items()]
    final_Q = result["final_Q"]
    # [print(item) for item in final_Q.items()]
    message = result["message"]
    path = result["path"]
    elapsed_time = result["elapsed_ms"]
    print(f"message: {message}")
    print(f'size of visited Q: {len(visited_Q)}')
    print(f"x: {path['x']}")
    print(f"y: {path['y']}")
    print(f"z: {path['z']}")
    print(f"elapsed_ms: {elapsed_time} ms")

    # print(medium_scenarios)
    for medium_3d_scenario_json in medium_scenarios:
        print(f'========== Medium 3D Scenario JSON: {medium_3d_scenario_json} ==========')
        with open(medium_3d_scenario_json) as file:
            medium_3d_scenario = json.load(file)
            file.close()
        
        print(f'Medium 3D Scenario Data Size: {medium_3d_scenario["data"]["size"]}')

        a_star = AStar(medium_3d_scenario)
        result = a_star.calculate_path()

        visited_Q = result["visited_Q"]
        message = result["message"]
        path = result["path"]
        elapsed_time = result["elapsed_ms"]
        print(f'message: {message}')
        print(f'size of visited Q: {len(visited_Q)}')
        print(f'path length: {len(path["x"])}')
        print(f'elapsed_ms: {elapsed_time} ms')
