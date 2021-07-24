from math import inf


class Tools:
    @staticmethod
    def find_the_minimum(hashmap, crux):
        obj_key = None
        obj_value = None
        minimum = inf
        for [key, obj] in hashmap.items():
            # print(key + ':' + str(obj.get_crux(crux)))
            if obj.get_crux(crux) <= minimum:
                obj_key = key
                obj_value = obj
                minimum = obj.get_crux(crux)

        return {
            "key": obj_key,
            "value": obj_value
        }
    
    @staticmethod
    def create_path_from_final_Q(final_Q, final_grid):
        is_2d = final_grid.is_2d
        new_x_array = [int(final_grid.x)]
        new_y_array = [int(final_grid.y)]
        new_z_array = [] if is_2d else [int(final_grid.z)]

        while final_grid.prev is not None:
            final_grid = final_Q.get(str(final_grid.prev))

            current_row = int(final_grid.x)
            current_col = int(final_grid.y)
            current_z = 0 if is_2d else int(final_grid.z)

            new_x_array.append(current_row)
            new_y_array.append(current_col)

            if not is_2d:
                new_z_array.append(current_z)

        return {
            "x": list(reversed(new_x_array)),
            "y": list(reversed(new_y_array)),
            "z": list(reversed(new_z_array))
        }
    
    @staticmethod
    def is_collinear(p1, p2, p3) -> bool:
        is_2d = True if ("z" not in p1 or p1["z"] is None) else False

        if is_2d:
            return ((p3["y"] - p2["y"]) * (p2["x"] - p1["x"]) == (p2["y"] - p1["y"]) * (p3["x"] - p2["x"]))
        else:
            x21 = p2["x"] - p1["x"]
            x31 = p3["x"] - p1["x"]
            y21 = p2["y"] - p1["y"]
            y31 = p3["y"] - p1["y"]
            z21 = p2["z"] - p1["z"]
            z31 = p3["z"] - p1["z"]
            crossX = y21 * z31 - y31 * z21
            crossY = x31 * z21 - x21 * z31
            crossZ = x21 * y31 - x31 * y21

            return (crossX == 0) and (crossY == 0) and (crossZ == 0)
    
    @staticmethod
    def refine_path_from_collinearity(path, debug_mode = False):
        is_2d = True if ("z" not in path or len(path["z"]) == 0) else False
        length = len(path["x"])

        if length == 0:
            print('[Error] Length of x array is zero.')
            return None

        if is_2d:
            if len(path["y"]) != length:
                print('[Error] Inconsistent vector lengths of x and y arrays in the path.')
                return None
        else:
            if len(path["y"]) != length or len(path["z"]) != length:
                print('[Error] Inconsistent vector lengths of x and y/z arrays in the path.')
                return None
        
        x = []
        y = []
        z = []

        log = ''
        i_point = 0
        while i_point < length - 2:
            temp_start_point = { "x": path["x"][i_point], "y": path["y"][i_point], "z": None if is_2d else path["z"][i_point] }
            
            log += f'[Add] Distinct point at {i_point}: {temp_start_point["x"]}, {temp_start_point["y"]}'
            log += '\n' if is_2d else f', {temp_start_point["z"]}\n'

            x.append(temp_start_point["x"])
            y.append(temp_start_point["y"])
            if "z" in temp_start_point:
                z.append(temp_start_point["z"])

            next_point = { "x": path["x"][i_point + 1], "y": path["y"][i_point + 1], "z": None if is_2d else path["z"][i_point + 1] }
            
            is_finished = False
            for j_point in range(i_point + 2, length):
                future_point = { "x": path["x"][j_point], "y": path["y"][j_point], "z": None if is_2d else path["z"][j_point] }
                
                if Tools.is_collinear(temp_start_point, next_point, future_point):
                    log += f'[Status] Collinear from {i_point} to {j_point}\n'

                    if j_point < length - 1:
                        continue
                    else:
                        last_point = { "x": path["x"][j_point], "y": path["y"][j_point], "z": None if is_2d else path["z"][j_point] }
                        
                        log += f'[Status] The last {j_point - i_point + 1} points are collinear.\n'
                        log += f'[Add] Distinct point at {j_point}: {last_point["x"]}, {last_point["y"]}'
                        log += '\n' if is_2d else f', {last_point["z"]}\n'

                        x.append(last_point["x"])
                        y.append(last_point["y"])
                        if "z" in last_point:
                            z.append(last_point["z"])

                        is_finished = True
                        break
                else:
                    i_point = j_point - 2
                    log += f'[Status] Update iPoint to {i_point}\n'
                    break

            if is_finished:
                break

            if i_point == length - 3:
                next_to_last_point = { "x": path["x"][length - 2], "y": path["y"][length - 2], "z": None if is_2d else path["z"][length - 2] }
                last_point = { "x": path["x"][length - 1], "y": path["y"][length - 1], "z": None if is_2d else path["z"][length - 1] }
                
                log += f'[Add] Distinct point at {length - 2}: {next_to_last_point["x"]}, {next_to_last_point["y"]}'
                log += '\n' if is_2d else f', {next_to_last_point["z"]}\n'
                log += f'[Add] Distinct point at {length - 1}: {last_point["x"]}, {last_point["y"]}'
                log += '\n' if is_2d else f', {last_point["z"]}\n'

                x.append(next_to_last_point["x"])
                x.append(last_point["x"])
                y.append(next_to_last_point["y"])
                y.append(last_point["y"])
                if "z" in next_to_last_point and "z" in last_point:
                    z.append(next_to_last_point["z"])
                    z.append(last_point["z"])
            
            i_point += 1

        if debug_mode:
            print(log)

        return { "x": x, "y": y, "z": z }
