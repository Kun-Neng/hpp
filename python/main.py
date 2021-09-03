import os
import json
from pyhpp.a_star import AStar
from pyhpp.dijkstra import Dijkstra


project_root_path = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
print(f'Root Path of Project: {project_root_path}')
small_2d_scenario_json = project_root_path + '\\scenarios\\small_2d_scenario.json'
small_3d_scenario_json = project_root_path + '\\scenarios\\small_3d_scenario.json'
print(f'========== Small 3D Scenario JSON: {small_3d_scenario_json} ==========')
medium_3d_scenarios = [project_root_path + f'\\scenarios\\medium_3d_scenario{i_scenario}.json' for i_scenario in range(1, 5)]
medium_2d_scenarios = [project_root_path + f'\\scenarios\\medium_2d_scenario{i_scenario}.json' for i_scenario in range(1, 5)]


def print_result(title, result, is_detailed=False):
    print(f"{title}")

    visited_Q = result['visited_Q']
    # final_Q = result['final_Q']
    elapsed_ms = result['elapsed_ms']
    path = result['path']
    refined_path = result['refined_path'] if 'refined_path' in result else None
    # message = result['message']

    print(f'size of visited Q: {len(visited_Q)}')
    print(f"elapsed_ms: {elapsed_ms} ms")
    if refined_path is not None:
        print(f'length: {len(path["x"])} => {len(refined_path["x"])}')
    else:
        print(f'length: {len(path["x"])}')
    
    if is_detailed is True:
        print('path:')
        print(f"x: {path['x']}")
        print(f"y: {path['y']}")
        print(f"z: {path['z']}")
        if refined_path is not None:
            print('refined_path:')
            print(f"x: {refined_path['x']}")
            print(f"y: {refined_path['y']}")
            print(f"z: {refined_path['z']}")
    
    print('\n')


if __name__ == "__main__":
    with open(small_2d_scenario_json) as file:
        small_2d_scenario = json.load(file)
        file.close()

    with open(small_3d_scenario_json) as file:
        small_3d_scenario = json.load(file)
        file.close()

    print(f'Small 2D Scenario Data Size: {small_2d_scenario["data"]["size"]}')
    original_2d_a_star = AStar(small_2d_scenario, {'debug_mode': True, 'type': 'original'})
    original_2d_result = original_2d_a_star.calculate_path()
    print_result('[original 2D A* result]', original_2d_result, True)

    fast_2d_a_star = AStar(small_2d_scenario, {'debug_mode': True, 'type': 'fast'})
    fast_2d_result = fast_2d_a_star.calculate_path()
    print_result('[fast 2D A* result]', fast_2d_result, True)

    print(f'Small 3D Scenario Data Size: {small_3d_scenario["data"]["size"]}')
    original_3d_a_star = AStar(small_3d_scenario, {'debug_mode': True, 'type': 'original'})
    # original_3d_a_star = AStar(small_3d_scenario)
    original_3d_result = original_3d_a_star.calculate_path()
    print_result('[original 3D A* result]', original_3d_result, True)

    fast_3d_a_star = AStar(small_3d_scenario, {'debug_mode': True, 'type': 'fast'})
    fast_3d_result = fast_3d_a_star.calculate_path()
    print_result('[fast 3D A* result]', fast_3d_result, True)

    i_scenario = 1
    # print(medium_3d_scenarios)
    for medium_3d_scenario_json in medium_3d_scenarios:
        with open(medium_3d_scenario_json) as file:
            medium_3d_scenario = json.load(file)
            file.close()
        
        print(f'Medium 3D Scenario Data Size: {medium_3d_scenario["data"]["size"]}')

        # a_star = AStar(medium_3d_scenario, {'debug_mode': True})
        a_star = AStar(medium_3d_scenario)
        result = a_star.calculate_path()
        if i_scenario == 1:
            print_result(f'[{medium_3d_scenario_json} result]', result, True)
        else:
            print_result(f'[{medium_3d_scenario_json} result]', result)
        i_scenario += 1
    
    i_scenario = 1
    # print(medium_2d_scenarios)
    for medium_2d_scenario_json in medium_2d_scenarios:
        with open(medium_2d_scenario_json) as file:
            medium_2d_scenario_grouping = json.load(file)
            file.close()
        
        print(f'Medium 2D Scenario Data Size: {medium_2d_scenario_grouping["data"]["size"]}')

        # a_star = AStar(medium_2d_scenario, {'debug_mode': True})
        medium_2d_scenario_grouping["grouping"] = { "radius": 1 }
        # a_star = AStar(medium_2d_scenario_grouping, {'debug_mode': True, 'type': 'original'})
        a_star = AStar(medium_2d_scenario_grouping, {'debug_mode': True, 'type': 'fast'})
        result = a_star.calculate_path()
        print_result(f'[{medium_2d_scenario_json} result]', result, False)
        i_scenario += 1
    
    dijkstra = Dijkstra(small_3d_scenario)
    dijkstra_result = dijkstra.calculate_path()
    print_result('[3D Dijkstra result]', dijkstra_result, True)
