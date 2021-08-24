import os
import json
from pyhpp.a_star import AStar
from pyhpp.dijkstra import Dijkstra


project_root_path = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
print(f'Root Path of Project: {project_root_path}')
small_3d_scenario_json = project_root_path + '\\scenarios\\small_3d_scenario.json'
print(f'========== Small 3D Scenario JSON: {small_3d_scenario_json} ==========')
medium_3d_scenarios = [project_root_path + f'\\scenarios\\medium_3d_scenario{i_scenario}.json' for i_scenario in range(1, 5)]
medium_2d_scenarios = [project_root_path + f'\\scenarios\\medium_2d_scenario{i_scenario}.json' for i_scenario in range(1, 5)]


if __name__ == "__main__":
    with open(small_3d_scenario_json) as file:
        small_3d_scenario = json.load(file)
        file.close()

    print(f'Small 3D Scenario Data Size: {small_3d_scenario["data"]["size"]}')
    
    print(f'========== A* (original) ==========')
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
    print(f"elapsed_ms: {original_elapsed_time} ms")
    print(f"x: {original_path['x']}")
    print(f"y: {original_path['y']}")
    print(f"z: {original_path['z']}")

    print(f'========== A* (fast) ==========')
    fast_a_star = AStar(small_3d_scenario, {'debug_mode': True, 'type': 'fast'})
    fast_result = fast_a_star.calculate_path()

    fast_visited_Q = fast_result["visited_Q"]
    fast_message = fast_result["message"]
    fast_path = fast_result["path"]
    fast_elapsed_time = fast_result["elapsed_ms"]
    print(f"message: {fast_message}")
    print(f'size of visited Q: {len(fast_visited_Q)}')
    print(f"elapsed_ms: {fast_elapsed_time} ms")
    print(f"length: {len(fast_path['x'])}")
    print(f"x: {fast_path['x']}")
    print(f"y: {fast_path['y']}")
    print(f"z: {fast_path['z']}")

    refined_path = fast_result["refined_path"]
    print(f"length: {len(refined_path['x'])}")
    print(f"x: {refined_path['x']}")
    print(f"y: {refined_path['y']}")
    print(f"z: {refined_path['z']}")

    i_scenario = 1
    # print(medium_3d_scenarios)
    for medium_3d_scenario_json in medium_3d_scenarios:
        print(f'========== Medium 3D Scenario JSON: {medium_3d_scenario_json} ==========')
        with open(medium_3d_scenario_json) as file:
            medium_2d_scenario_grouping = json.load(file)
            file.close()
        
        print(f'Medium 3D Scenario Data Size: {medium_2d_scenario_grouping["data"]["size"]}')

        # a_star = AStar(medium_3d_scenario, {'debug_mode': True})
        a_star = AStar(medium_2d_scenario_grouping)
        result = a_star.calculate_path()

        visited_Q = result["visited_Q"]
        message = result["message"]
        path = result["path"]
        refined_path = result["refined_path"]
        elapsed_time = result["elapsed_ms"]
        print(f'message: {message}')
        print(f'size of visited Q: {len(visited_Q)}')
        print(f'path length: {len(path["x"])} => {len(refined_path["x"])}')
        if i_scenario == 1:
            print(f'x: {path["x"]}')
            print(f'y: {path["y"]}')
            print(f'z: {path["z"]}')
        print(f'x: {refined_path["x"]}')
        print(f'y: {refined_path["y"]}')
        print(f'z: {refined_path["z"]}')
        print(f'elapsed_ms: {elapsed_time} ms')

        i_scenario += 1
    
    i_scenario = 1
    # print(medium_2d_scenarios)
    for medium_2d_scenario_json in medium_2d_scenarios:
        print(f'========== Medium 2D Scenario JSON: {medium_2d_scenario_json} ==========')
        with open(medium_2d_scenario_json) as file:
            medium_2d_scenario_grouping = json.load(file)
            file.close()
        
        print(f'Medium 2D Scenario Data Size: {medium_2d_scenario_grouping["data"]["size"]}')

        # a_star = AStar(medium_3d_scenario, {'debug_mode': True})
        medium_2d_scenario_grouping["grouping"] = {
            "radius": 1
        }
        a_star = AStar(medium_2d_scenario_grouping)
        result = a_star.calculate_path()

        visited_Q = result["visited_Q"]
        message = result["message"]
        path = result["path"]
        refined_path = result["refined_path"]
        elapsed_time = result["elapsed_ms"]
        print(f'message: {message}')
        print(f'size of visited Q: {len(visited_Q)}')
        print(f'path length: {len(path["x"])} => {len(refined_path["x"])}')
        # if i_scenario == 1:
        #     print(f'x: {path["x"]}')
        #     print(f'y: {path["y"]}')
        print(f'x: {refined_path["x"]}')
        print(f'y: {refined_path["y"]}')
        print(f'elapsed_ms: {elapsed_time} ms')

        i_scenario += 1

    print(f'========== Dijkstra ==========')
    dijkstra = Dijkstra(small_3d_scenario)
    dijkstra_result = dijkstra.calculate_path()

    dijkstra_visited_Q = dijkstra_result["visited_Q"]
    dijkstra_message = dijkstra_result["message"]
    dijkstra_path = dijkstra_result["path"]
    dijkstra_elapsed_time = dijkstra_result["elapsed_ms"]
    print(f"message: {dijkstra_message}")
    print(f'size of visited Q: {len(dijkstra_visited_Q)}')
    print(f"elapsed_ms: {dijkstra_elapsed_time} ms")
    print(f"x: {dijkstra_path['x']}")
    print(f"y: {dijkstra_path['y']}")
    print(f"z: {dijkstra_path['z']}")
