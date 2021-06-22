from math import inf
from math import sqrt


class Grid:
    def __init__(self, x, y, z = None):
        self.x = int(x)
        self.y = int(y)
        self.z = None if z is None else int(z)
        self.is_2d = True if z is None else False

        self.prev = None
        self.dist = inf
        self.f = inf

    def __str__(self):
        return str(self.x) + ',' + str(self.y) if self.is_2d \
            else str(self.x) + ',' + str(self.y) + ',' + str(self.z)

    def __eq__(self, other):
        return str(self) == str(other)

    def set_as_start_grid(self):
        self.dist = 0
    
    def shift(self, x, y, z = 0):
        return Grid(self.x + int(x), self.y + int(y)) if self.is_2d \
            else Grid(self.x + int(x), self.y + int(y), self.z + int(z))

    def distance_to(self, destGrid) -> float:
        dist_X = abs(destGrid.x - self.x)
        dist_Y = abs(destGrid.y - self.y)

        if self.is_2d:
            return sqrt(dist_X * dist_X + dist_Y * dist_Y)
        else:
            dist_Z = abs(destGrid.z - self.z)
            return sqrt(dist_X * dist_X + dist_Y * dist_Y + dist_Z * dist_Z)
    
    def is_out_of_bound(self, bound_x = [-inf, inf], bound_y = [-inf, inf], bound_z = [-inf, inf]) -> bool:
        minX = min(*bound_x)
        maxX = max(*bound_x)
        minY = min(*bound_y)
        maxY = max(*bound_y)
        
        if self.is_2d:
            return self.x <= minX or self.x >= maxX or self.y <= minY or self.y >= maxY
        else:
            minZ = min(*bound_z)
            maxZ = max(*bound_z)
            return self.x <= minX or self.x >= maxX or self.y <= minY or self.y >= maxY or self.z <= minZ or self.z >= maxZ
