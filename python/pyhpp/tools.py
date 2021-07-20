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
