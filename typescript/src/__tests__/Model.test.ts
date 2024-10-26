import { describe, test, expect } from '@jest/globals';
import { Node } from '../Node';
import { Model } from '../Model';

test('test_is_2d', () => {
  const dimension2D1 = { "x": 10, "y": 10 };
  expect(Model.is2d(dimension2D1)).toBe(true);

  const dimension2D2 = { "x": 10, "y": 10, "z": 0 };
  expect(Model.is2d(dimension2D2)).toBe(true);

  const dimension2D3 = { "x": 10, "y": 10, "z": -5 };
  expect(Model.is2d(dimension2D3)).toBe(true);

  const dimension3D = { "x": 10, "y": 10, "z": 10 };
  expect(Model.is2d(dimension3D)).toBe(false);
});

test('test_check_num_obstacles', () => {
  // createObstacleArray
  const obstacleArray = Model.createObstacleArray();
  expect(obstacleArray.length).toBe(0);

  const scenario_empty_data = {
    "size": 0,
    "x": [1, 2, 3],
    "y": [1, 2, 3]
  };
  const obstacleEmptyArray = Model.createObstacleArray(scenario_empty_data);
  expect(obstacleEmptyArray.length).toBe(0);

  const scenario_2d_data = {
    "size": 16,
    "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
    "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    // "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
  };
  const obstacle2DArray = Model.createObstacleArray(scenario_2d_data);
  expect(obstacle2DArray.length).toBe(scenario_2d_data.size);

  const scenario_3d_data = {
    "size": 16,
    "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
    "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
  };
  const obstacle3DArray = Model.createObstacleArray(scenario_3d_data);
  expect(obstacle3DArray.length).toBe(scenario_3d_data.size);

  // createObstacleSet
  const obstacleSet = Model.createObstacleSet();
  expect(obstacleSet.size).toBe(0);

  const obstacleEmptySet = Model.createObstacleSet(scenario_empty_data);
  expect(obstacleEmptySet.size).toBe(0);

  const obstacle2DSet = Model.createObstacleSet(scenario_2d_data);
  expect(obstacle2DSet.size).toBe(4); // redundant data is removed

  const obstacle3DSet = Model.createObstacleSet(scenario_3d_data);
  expect(obstacle3DSet.size).toBe(scenario_3d_data.size);
});

test('test_nodes_on_obstacles', () => {
  const scenario_3d_data = {
    "size": 16,
    "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
    "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
  };
  const obstacle3dArray = Model.createObstacleArray(scenario_3d_data);

  const testGoodWaypointArray = [
    new Node(5, 9, 2),
    new Node(5, 0, 4)
  ];
  expect(Model.nodesOnObstacles(obstacle3dArray, testGoodWaypointArray)).toBe(false);

  const testErrorWaypointArray = [
    new Node(5, 9, 2),
    new Node(6, 6, 5)
  ];
  expect(Model.nodesOnObstacles(obstacle3dArray, testErrorWaypointArray)).toBe(true);
});

test('test_boundary', () => {
  const scenario = {
    "waypoint": {
      "start": { "x": 5, "y": 9, "z": 2 },
      "stop": { "x": 5, "y": 0, "z": 4 },
      "allowDiagonal": false
    },
    "boundary": {
      "zCeil": 6,
      "zFloor": 1
    }
  };
  const zStart = Number(scenario.waypoint.start.z);
  const zCeil = Number(scenario.boundary.zCeil);
  const zFloor = Number(scenario.boundary.zFloor);
  expect(Model.isBoundaryAvailable(zFloor, zStart, zCeil)).toBe(true);

  expect(Model.isBoundaryAvailable(zFloor, 0, zCeil)).toBe(false);
  expect(Model.isBoundaryAvailable(zFloor, 6, zCeil)).toBe(false);
});

test('test_create_initial_Q', () => {
  const scenario_2d = {
    "dimension": { "x": 15, "y": 15 },
    "waypoint": {
      "start": { "x": 12, "y": 0 },
      "stop": { "x": 1, "y": 11 },
      "allowDiagonal": false
    },
    "data": {
      "size": 28,
      "x": [2, 2, 2, 2, 2, 2, 2, 2,
        3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
      "y": [5, 6, 7, 8, 9, 10, 11, 12,
        12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
  };

  const obstacle2DArray = Model.createObstacleArray(scenario_2d.data);
  const model2D = new Model(scenario_2d.dimension, obstacle2DArray, scenario_2d.waypoint);
  const Q2D = model2D.createInitialQ();

  const numberObstacleNodes2D = (scenario_2d.dimension.x * scenario_2d.dimension.y) - scenario_2d.data.size;
  expect(Q2D.size).toBe(numberObstacleNodes2D);

  const scenario_3d = {
    "dimension": { "x": 10, "y": 10, "z": 10 },
    "waypoint": {
      "start": { "x": 5, "y": 9, "z": 2 },
      "stop": { "x": 6, "y": 6, "z": 5 },
      "allowDiagonal": false
    },
    "data": {
      "size": 16,
      "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
      "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    }
  };

  const obstacle3DArray = Model.createObstacleArray(scenario_3d.data);
  const model3D = new Model(scenario_3d.dimension, obstacle3DArray, scenario_3d.waypoint);
  const isFast = false
  const Q3D = model3D.createInitialQ(isFast);

  const numberObstacleNodes3D = (scenario_3d.dimension.x * scenario_3d.dimension.y * scenario_3d.dimension.z) - scenario_3d.data.size;
  expect(Q3D.size).toBe(numberObstacleNodes3D);
});
