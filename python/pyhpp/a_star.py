import time
from math import inf, sqrt
from pyhpp.node import Node
from pyhpp.model import Model
from pyhpp.tools import Tools


class AStar:
    def __init__(self, scenario, options=None):
        dimension = scenario["dimension"]
        self.is_2d = Model.is_two_dimensional(dimension)

        if "data" in scenario:
            self.obstacle_array = Model.create_obstacle_array(scenario["data"])
        else:
            self.obstacle_array = []
        self.num_obstacles = len(self.obstacle_array)

        self.waypoint = scenario["waypoint"]
        start = self.waypoint["start"]
        self.start_node = Node(start["x"], start["y"]) if self.is_2d else Node(start["x"], start["y"], start["z"])
        self.start_node.set_as_start_node()
        stop = self.waypoint["stop"]
        self.stop_node = Node(stop["x"], stop["y"]) if self.is_2d else Node(stop["x"], stop["y"], stop["z"])
        self.last_node_key = str(self.stop_node)
        self.allow_diagonal = bool(self.waypoint["allowDiagonal"]) if "allowDiagonal" in self.waypoint else False

        if options is None:
            debug_mode = False
            is_fast = True
        else:
            debug_mode = True if 'debug_mode' in options and options['debug_mode'] is True else False
            is_fast = False if 'type' in options and options['type'] == 'original' else True

        model = Model(dimension, self.obstacle_array, self.waypoint, debug_mode)
        self.Q = model.create_initial_Q(is_fast)

        self.open_set = dict()
        self.open_set[str(self.start_node)] = self.Q.get(str(self.start_node))

        if Model.nodes_on_obstacles(self.obstacle_array, [self.start_node, self.stop_node]):
            message = "[Waypoint Error] start position or stop position is on the obstacle."
            print(message)
            self.message = message

        self.boundary = scenario["boundary"] if "boundary" in scenario else None
        if not self.is_2d:
            self.z_ceil = int(self.boundary["zCeil"]) if (self.boundary and "zCeil" in self.boundary) else inf
            self.z_floor = int(self.boundary["zFloor"]) if (self.boundary and "zFloor" in self.boundary) else -inf
            # print("z_ceil: {}, z_floor: {}".format(self.z_ceil, self.z_floor))

            if not Model.is_boundary_available(self.z_floor, self.start_node.z, self.z_ceil):
                message = "[Boundary Error] start position is out of boundary."
                print(message)
                self.message = message
        
        grouping = scenario["grouping"] if "grouping" in scenario else None
        self.is_grouping = True if grouping is not None and "radius" in grouping and str(grouping["radius"]).isnumeric() else False
        self.group_radius = float(grouping["radius"]) if self.is_grouping else 0
        self.is_group_flat = True if self.is_2d or "boundary" in scenario else False

        if self.is_grouping:
            print("[Grouping] radius", self.group_radius, "of", {"circle" if self.is_group_flat else "sphere"})
            for obstacle in self.obstacle_array:
                if self.intersect(self.start_node, obstacle):
                    message = "[Grouping Error] obstacle is in the start", {"circle" if self.is_group_flat else "sphere"}
                    print(message)
                if self.intersect(self.stop_node, obstacle):
                    message = "[Grouping Error] obstacle is in the stop", {"circle" if self.is_group_flat else "sphere"}
                    print(message)
        
        self.message = "[Ready] No Results."

    def calculate_path(self):
        # print("A* Path Finding (2D)") if self.is_2d else print("A* Path Finding (3D)")
        final_Q = dict()
        visited_Q = dict()

        calculate_start_time = time.time()

        size = len(self.open_set)
        while size > 0:
            obj = Tools.find_the_minimum(self.open_set, 'f')
            obj_key = obj["key"]
            current_node = obj["value"]
            final_Q[obj_key] = current_node
            if obj_key is not None:
                self.last_node_key = str(obj_key)
            del self.open_set[obj_key]

            if current_node == self.stop_node:
                message = "[Done] Arrival! 🚀"
                print(message)
                self.message = message
                break

            shift_node = [-1, 0, 1]
            for shift_row in shift_node:
                for shift_col in shift_node:
                    if self.is_2d:
                        is_not_diagonal = (shift_row == 0 or shift_col == 0) and (shift_row != shift_col)
                        is_diagonal = not (shift_row == 0 and shift_col == 0)

                        is_allowed = is_diagonal if self.allow_diagonal else is_not_diagonal
                        if is_allowed:
                            neighbor_node = current_node.shift(shift_row, shift_col)
                            neighbor = self.Q.get(str(neighbor_node))

                            if neighbor is not None and str(neighbor_node) not in final_Q:
                                visited_Q[str(neighbor_node)] = neighbor

                                if str(neighbor_node) not in self.open_set:
                                    self.open_set[str(neighbor_node)] = neighbor

                                dist = sqrt(shift_row ** 2 + shift_col ** 2)
                                alt = current_node.dist + dist
                                if alt < neighbor.dist:
                                    neighbor.dist = alt
                                    neighbor.f = alt + neighbor.manhattan_distance_to(self.stop_node)
                                    # neighbor["f"] = alt + sqrt(dist_x ** 2 + dist_y ** 2)
                                    neighbor.prev = str(current_node)
                                    self.open_set[str(neighbor_node)] = neighbor
                    else:
                        for shift_z in shift_node:
                            is_not_diagonal = ((shift_row == 0 or shift_col == 0) and (shift_row != shift_col)) \
                                or (shift_row == 0 and shift_col == 0)
                            is_diagonal = not (shift_row == 0 and shift_col == 0 and shift_z == 0)

                            is_allowed = is_diagonal if self.allow_diagonal else is_not_diagonal
                            if is_allowed:
                                neighbor_node = current_node.shift(shift_row, shift_col, shift_z)

                                if neighbor_node.is_out_of_bound(bound_z = [self.z_floor, self.z_ceil]):
                                    continue

                                # Full search (time-consuming) = 2D
                                # neighbor = self.Q.get(str(neighbor_node))
                                # if neighbor is not None and str(neighbor_node) not in final_Q:
                                #     visited_Q[str(neighbor_node)] = neighbor
                                #
                                #     dist = sqrt(shift_row ** 2 + shift_col ** 2 + shift_z ** 2)
                                #     alt = current_obj["dist"] + dist
                                #     # ...

                                # Fast search
                                if self.is_grouping:
                                    is_obstacle_found = False
                                    for obstacle_node in self.obstacle_array:
                                        if self.intersect(neighbor_node, obstacle_node):
                                            is_obstacle_found = True
                                            # no more to check the other collisions
                                            break
                                    if is_obstacle_found:
                                        # continue to find the next neighbor
                                        continue
                                else:
                                    is_obstacle_found = False
                                    for index in range(self.num_obstacles):
                                        obstacle_node = self.obstacle_array[index]
                                        if obstacle_node == neighbor_node:
                                            # Find out an obstacle on the neighbor node
                                            is_obstacle_found = True
                                            break
                                    if is_obstacle_found:
                                        continue

                                # has_key was removed in Python 3
                                # https://docs.python.org/3.0/whatsnew/3.0.html#builtins
                                # print(final_Q.has_key(neighborPosition))
                                if str(neighbor_node) in final_Q:
                                    continue

                                neighbor = visited_Q.get(str(neighbor_node))
                                if neighbor is None:
                                    neighbor = Node(neighbor_node.x, neighbor_node.y, neighbor_node.z)
                                    visited_Q[str(neighbor_node)] = neighbor

                                if str(neighbor_node) not in self.open_set:
                                    self.open_set[str(neighbor_node)] = neighbor

                                dist = sqrt(shift_row ** 2 + shift_col ** 2 + shift_z ** 2)
                                alt = current_node.dist + dist
                                if alt < neighbor.dist:
                                    neighbor.dist = alt
                                    neighbor.f = alt + neighbor.manhattan_distance_to(self.stop_node)
                                    neighbor.prev = str(current_node)
                                    self.open_set[str(neighbor_node)] = neighbor

            size = len(self.open_set)

        calculate_end_time = time.time()
        elapsed_ms = 1000.0 * (calculate_end_time - calculate_start_time)
        final_node = final_Q.get(str(self.last_node_key))
        path = Tools.create_path_from_final_Q(final_Q, final_node)
        refined_path = Tools.refine_path_from_collinearity(path)
        
        return {
            "visited_Q": visited_Q,
            "final_Q": final_Q,
            "elapsed_ms": elapsed_ms,
            "path": path,
            "refined_path": refined_path,
            "message": self.message
        }
    
    def intersect(self, group_center_node, obstacle_node) -> bool:
        [box_min_x, box_max_x, box_min_y, box_max_y] = [
            obstacle_node.x - 0.5, obstacle_node.x + 0.5,
            obstacle_node.y - 0.5, obstacle_node.y + 0.5
        ]
        x = max(box_min_x, min(group_center_node.x, box_max_x))
        y = max(box_min_y, min(group_center_node.y, box_max_y))

        if self.is_group_flat:
            flat_center_node = Node(group_center_node.x, group_center_node.y)
            closest_point = Node(x, y)
            # distance = sqrt(pow(x - group_center_node.x, 2) + pow(y - group_center_node.y, 2))
            distance = flat_center_node.distance_to(closest_point)

            return distance <= self.group_radius
        else:
            [boxMinZ, boxMaxZ] = [obstacle_node.z - 0.5, obstacle_node.z + 0.5]
            z = max(boxMinZ, min(group_center_node.z, boxMaxZ))
            closest_point = Node(x, y, z)
            distance = group_center_node.distance_to(closest_point)
        
            return distance <= self.group_radius
