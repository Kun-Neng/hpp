import time
from math import inf, sqrt
from pyhpp.grid import Grid
from pyhpp.model import Model
from pyhpp.tools import Tools


class Dijkstra:
    def __init__(self, scenario):
        dimension = scenario["dimension"]
        self.is_2d = Model.is_two_dimensional(dimension)

        if "data" in scenario:
            self.obstacle_array = Model.create_obstacle_array(scenario["data"])
        else:
            self.obstacle_array = []
        self.num_obstacles = len(self.obstacle_array)

        self.waypoint = scenario["waypoint"]
        start = self.waypoint["start"]
        self.start_grid = Grid(start["x"], start["y"]) if self.is_2d else Grid(start["x"], start["y"], start["z"])
        self.start_grid.set_as_start_grid()
        stop = self.waypoint["stop"]
        self.stop_grid = Grid(stop["x"], stop["y"]) if self.is_2d else Grid(stop["x"], stop["y"], stop["z"])
        self.last_grid_key = str(self.stop_grid)
        self.allow_diagonal = bool(self.waypoint["allowDiagonal"]) if "allowDiagonal" in self.waypoint else False
        
        model = Model(dimension, self.obstacle_array, self.waypoint, True)
        self.Q = model.create_initial_Q()

        self.open_set = dict()
        self.open_set[str(self.start_grid)] = self.Q.get(str(self.start_grid))

        if Model.grids_on_obstacles(self.obstacle_array, [self.start_grid, self.stop_grid]):
            message = "[Waypoint Error] start position or stop position is on the obstacle."
            print(message)
            self.message = message
        
        self.boundary = scenario["boundary"] if "boundary" in scenario else None
        if not self.is_2d:
            self.z_ceil = int(self.boundary["zCeil"]) if (self.boundary and "zCeil" in self.boundary) else inf
            self.z_floor = int(self.boundary["zFloor"]) if (self.boundary and "zFloor" in self.boundary) else -inf
            # print("z_ceil: {}, z_floor: {}".format(self.z_ceil, self.z_floor))

            if not Model.is_boundary_available(self.z_floor, self.start_grid.z, self.z_ceil):
                message = "[Boundary Error] start position is out of boundary."
                print(message)
                self.message = message
        
        self.message = "[Ready] No Results."
    
    def create_path_from_final_Q(self, final_Q):
        final_grid = final_Q.get(str(self.stop_grid))
        if final_grid is None:
            final_grid = final_Q.get(str(self.last_grid_key))
        
        if final_grid is None:
            final_grid = self.start_grid

        new_x_array = [int(final_grid.x)]
        new_y_array = [int(final_grid.y)]
        new_z_array = [] if self.is_2d else [int(final_grid.z)]

        while final_grid.prev is not None:
            final_grid = final_Q.get(str(final_grid.prev))

            current_row = int(final_grid.x)
            current_col = int(final_grid.y)
            current_z = 0 if self.is_2d else int(final_grid.z)

            new_x_array.append(current_row)
            new_y_array.append(current_col)

            if not self.is_2d:
                new_z_array.append(current_z)

        return {
            "x": list(reversed(new_x_array)),
            "y": list(reversed(new_y_array)),
            "z": list(reversed(new_z_array))
        }
    
    def calculate_path(self):
        # print("A* Path Finding (2D)") if self.is_2d else print("A* Path Finding (3D)")
        final_Q = dict()
        visited_Q = dict()

        calculate_start_time = time.time()

        size = len(self.open_set)
        while size > 0:
            obj = Tools.find_the_minimum(self.open_set, 'dist')
            obj_key = obj["key"]
            current_grid = obj["value"]
            final_Q[obj_key] = current_grid
            if obj_key is not None:
                self.last_grid_key = str(obj_key)
            del self.open_set[obj_key]

            if current_grid == self.stop_grid:
                message = "[Done] Arrival! 🚀"
                print(message)
                self.message = message
                break

            shift_grid = [-1, 0, 1]
            for shift_row in shift_grid:
                for shift_col in shift_grid:
                    if self.is_2d:
                        is_not_diagonal = (shift_row == 0 or shift_col == 0) and (shift_row != shift_col)
                        is_diagonal = not (shift_row == 0 and shift_col == 0)

                        is_allowed = is_diagonal if self.allow_diagonal else is_not_diagonal
                        if is_allowed:
                            neighbor_grid = current_grid.shift(shift_row, shift_col)
                            neighbor = self.Q.get(str(neighbor_grid))

                            if neighbor is not None and str(neighbor_grid) not in final_Q:
                                visited_Q[str(neighbor_grid)] = neighbor

                                if str(neighbor_grid) not in self.open_set:
                                    self.open_set[str(neighbor_grid)] = neighbor

                                dist = sqrt(shift_row ** 2 + shift_col ** 2)
                                alt = current_grid.dist + dist
                                if alt < neighbor.dist:
                                    neighbor.dist = alt
                                    neighbor.prev = str(current_grid)
                                    self.open_set[str(neighbor_grid)] = neighbor
                    else:
                        for shift_z in shift_grid:
                            is_not_diagonal = ((shift_row == 0 or shift_col == 0) and (shift_row != shift_col)) \
                                or (shift_row == 0 and shift_col == 0)
                            is_diagonal = not (shift_row == 0 and shift_col == 0 and shift_z == 0)

                            is_allowed = is_diagonal if self.allow_diagonal else is_not_diagonal
                            if is_allowed:
                                neighbor_grid = current_grid.shift(shift_row, shift_col, shift_z)

                                if neighbor_grid.is_out_of_bound(bound_z = [self.z_floor, self.z_ceil]):
                                    continue

                                # Full search (time-consuming) = 2D
                                # neighbor = self.Q.get(str(neighbor_grid))
                                # if neighbor is not None and str(neighbor_grid) not in final_Q:
                                #     visited_Q[str(neighbor_grid)] = neighbor
                                #
                                #     dist = sqrt(shift_row ** 2 + shift_col ** 2 + shift_z ** 2)
                                #     alt = current_obj["dist"] + dist
                                #     # ...

                                # Fast search
                                is_obstacle_found = False
                                for index in range(self.num_obstacles):
                                    obstacle_grid = self.obstacle_array[index]
                                    if obstacle_grid == neighbor_grid:
                                        # Find out an obstacle on the neighbor grid
                                        is_obstacle_found = True
                                        break
                                if is_obstacle_found:
                                    continue

                                # has_key was removed in Python 3
                                # https://docs.python.org/3.0/whatsnew/3.0.html#builtins
                                # print(final_Q.has_key(neighborPosition))
                                if str(neighbor_grid) in final_Q:
                                    continue

                                neighbor = visited_Q.get(str(neighbor_grid))
                                if neighbor is None:
                                    neighbor = Grid(neighbor_grid.x, neighbor_grid.y, neighbor_grid.z)
                                    visited_Q[str(neighbor_grid)] = neighbor

                                if str(neighbor_grid) not in self.open_set:
                                    self.open_set[str(neighbor_grid)] = neighbor

                                dist = sqrt(shift_row ** 2 + shift_col ** 2 + shift_z ** 2)
                                alt = current_grid.dist + dist
                                if alt < neighbor.dist:
                                    neighbor.dist = alt
                                    neighbor.prev = str(current_grid)
                                    self.open_set[str(neighbor_grid)] = neighbor

            size = len(self.open_set)

        calculate_end_time = time.time()
        
        return {
            "visited_Q": visited_Q,
            "final_Q": final_Q,
            "elapsed_ms": 1000.0 * (calculate_end_time - calculate_start_time),
            "path": self.create_path_from_final_Q(final_Q),
            "message": self.message
        }