# pyhpp
#### Python Package for A* Algorithms

* Step 1: import A* algorithm
```
from pyhpp.a_star import AStar
```

* Step 2: prepare a JSON type scenario, e.g.,
```
scenario = {
    "dimension": {"x": 10, "y": 10, "z": 10},
    "waypoint": {
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": False
    },
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
}
```
> `dimension`: [required] whole dimension of the scenario<br>
> `waypoint`: [required] start and stop positions (default `allowDiagonal` is `False`)<br>
> `data`: obstacle data (set as empty if none)<br>
> `boundary`: the z-axis boundary of path for calculation<br>

* Step 3: create an A* instance
```
a_star = AStar(scenario)
```

* Step 4: calculate and get the results
```
result = a_star.calculate_path()

# visited_Q = result["visitedQ"]
# final_Q = result["finalQ"]
path = result["path"]
```
> `visitedQ`: all the visited positions<br>
> `finalQ`: all the positions in the A* path<br>
> `path`: reversed A* path that is from stop to start<br>
