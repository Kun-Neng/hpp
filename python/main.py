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
    
    original_a_star = AStar(small_3d_scenario, {'debug_mode': True, 'type': 'original'})
    # original_a_star = AStar(small_3d_scenario)
    original_result = original_a_star.calculate_path()

    # for [key, value] in original_result.items():
    #     print(key, value)

    original_visited_Q = original_result["visited_Q"]
    # [print(item) for item in original_visited_Q.items()]
    # original_final_Q = original_result["final_Q"]
    # [print(item) for item in original_final_Q.items()]
    original_message = original_result["message"]
    original_path = original_result["path"]
    original_elapsed_time = original_result["elapsed_ms"]
    print(f"message: {original_message}")
    print(f'size of visited Q: {len(original_visited_Q)}')
    print(f"x: {original_path['x']}")
    print(f"y: {original_path['y']}")
    print(f"z: {original_path['z']}")
    print(f"elapsed_ms: {original_elapsed_time} ms")

    fast_a_star = AStar(small_3d_scenario, {'debug_mode': True, 'type': 'fast'})
    fast_result = fast_a_star.calculate_path()

    fast_visited_Q = fast_result["visited_Q"]
    fast_message = fast_result["message"]
    fast_path = fast_result["path"]
    fast_elapsed_time = fast_result["elapsed_ms"]
    print(f"message: {fast_message}")
    print(f'size of visited Q: {len(fast_visited_Q)}')
    print(f"x: {fast_path['x']}")
    print(f"y: {fast_path['y']}")
    print(f"z: {fast_path['z']}")
    print(f"elapsed_ms: {fast_elapsed_time} ms")

    # print(medium_scenarios)
    for medium_3d_scenario_json in medium_scenarios:
        print(f'========== Medium 3D Scenario JSON: {medium_3d_scenario_json} ==========')
        with open(medium_3d_scenario_json) as file:
            medium_3d_scenario = json.load(file)
            file.close()
        
        print(f'Medium 3D Scenario Data Size: {medium_3d_scenario["data"]["size"]}')

        # a_star = AStar(medium_3d_scenario, {'debug_mode': True})
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
