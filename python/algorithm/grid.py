from math import inf


class Grid:
    def __init__(self, x, y, z=0, is_2d=True):
        self.x = int(x)
        self.y = int(y)
        self.z = int(z)
        self.is_2d = bool(is_2d)

    def __str__(self):
        return str(self.x) + ',' + str(self.y) if self.is_2d \
            else str(self.x) + ',' + str(self.y) + ',' + str(self.z)

    def __eq__(self, other):
        return (self.x == other.x) and (self.y == other.y) if self.is_2d \
            else (self.x == other.x) and (self.y == other.y) and (self.z == other.z)

    def shift(self, x, y, z=0):
        return Grid(self.x + int(x), self.y + int(y), self.z + int(z), self.is_2d)

    def is_out_of_bound(self, bound_z=None, bound_x=None, bound_y=None):
        if bound_z is None:
            bound_z = [-inf, inf]
        if bound_x is None:
            bound_x = [-inf, inf]
        if bound_y is None:
            bound_y = [-inf, inf]

        return self.z <= bound_z[0] or self.z >= bound_z[1] or \
            self.x <= bound_x[0] or self.x >= bound_x[1] or \
            self.y <= bound_y[0] or self.y >= bound_y[1]
