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
