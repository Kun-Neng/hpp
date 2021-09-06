jshpp
======
#### Node Package for Path Planning Algorithms ####

[![GitHub license](https://img.shields.io/github/license/Kun-Neng/hpp)](https://github.com/Kun-Neng/hpp/blob/main/LICENSE)

Steps
------
* Step 1: import A* algorithm
```javascript
const AStar = require('jshpp').AStar;
```

* Step 2: prepare a JSON type scenario, e.g.,
```javascript
const scenario = {
    "dimension": {"x": 10, "y": 10, "z": 10},
    "waypoint": {
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": false
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
};
```
> `dimension`: [required] whole dimension of the scenario. Two dimensional scenario can be set up when `"z": 0`<br>
> `waypoint`: [required] start and stop positions (default `allowDiagonal` is `False`)<br>
> `data`: obstacle data (set as empty if none)<br>
> `boundary`: the z-axis boundary of path for calculation<br>

* Step 3: create an A* instance
```javascript
const aStar = new AStar(scenario);
```

* Step 4: calculate and get the results
```javascript
const result = aStar.calculatePath();

const visited_Q = result.visited_Q;
const final_Q = result.final_Q;
const path = result.path;
```
This returned `result` contains the following main properties
> `visited_Q`: all the visited positions<br>
> `final_Q`: all the positions in the A* path<br>
> `path`: the A* path array from start to stop<br>
> `refined_path`: the A* path with minimum number of points<br>

and some useful information
> `message`: the information about path planning<br>
> `elapsed_ms`: the running milliseconds of path planning
