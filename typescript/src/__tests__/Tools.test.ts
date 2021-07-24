import {Grid} from '../Grid';
import {Model} from '../Model';
import Tools from '../Tools';

const scenario = {
    "dimension": {"x": 10, "y": 10, "z": 10},
    "empty_data": {},
    "no_data": {"size": 0, "x": [], "y": [], "z": []},
    "data": {
        "size": 16,
        "x": [4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7, 4, 5, 6, 7],
        "y": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        "z": [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
    },
    "waypoint": {
        "start": {"x": 5, "y": 9, "z": 2},
        "stop": {"x": 5, "y": 0, "z": 4},
        "allowDiagonal": false
    },
    "boundary": {
        "zCeil": 6,
        "zFloor": 1
    }
};

const scenario_2d = {
    "dimension": {"x": 15, "y": 15},
    "waypoint": {
        "start": {"x": 12, "y": 0},
        "stop": {"x": 1, "y": 11},
        "allowDiagonal": false
    },
    "data": {
        "size": 28,
        "x": [ 2,  2,  2,  2,  2,  2,  2,  2,
               3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
              12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        "y": [ 5,  6,  7,  8,  9, 10, 11, 12,
              12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
               2,  3,  4,  5,  6,  7,  8,  9, 10, 11]
    }
};

test('test_find_the_min_F', () => {
    const obstacle2DArray = Model.createObstacleArray(scenario_2d.data);
    const model2D = new Model(scenario_2d.dimension, obstacle2DArray, scenario_2d.waypoint);
    const Q2D = model2D.createInitialQ();

    const minGrid2D = Tools.findTheMinimum(Q2D, 'f');
    expect(minGrid2D.key).toBe('12,0');
    expect(minGrid2D.value.dist).toBe(0);

    const obstacle3DArray = Model.createObstacleArray(scenario.data);
    const model3D = new Model(scenario.dimension, obstacle3DArray, scenario.waypoint);
    const isFast = true;
    const Q3D = model3D.createInitialQ(isFast);
    
    const minGrid3D = Tools.findTheMinimum(Q3D, 'f');
    expect(minGrid3D.key).toBe('5,9,2');
    expect(minGrid3D.value.dist).toBe(0);
});

test('test_create_path_from_finalQ', () => {
    const startGrid = new Grid(12, 0);
    const stopGrid = new Grid(1, 11);
    const hashmap2D = new Map<string, Grid>();

    const no_result2D = Tools.createPathFromFinalQ(hashmap2D, startGrid);
    expect(no_result2D.x[0]).toBe(startGrid.x);
    expect(no_result2D.y[0]).toBe(startGrid.y);
    expect(no_result2D.z.length).toBe(0);

    const lastGrid = new Grid(6, 6);
    startGrid.prev = lastGrid;
    hashmap2D.set(lastGrid.str(), lastGrid);
    const partial_result2D = Tools.createPathFromFinalQ(hashmap2D, lastGrid);
    expect(partial_result2D.x[0]).toBe(lastGrid.x);
    expect(partial_result2D.y[0]).toBe(lastGrid.y);

    lastGrid.prev = stopGrid;
    const great_result2D = Tools.createPathFromFinalQ(hashmap2D, stopGrid);
    expect(great_result2D.x[0]).toBe(stopGrid.x);
    expect(great_result2D.y[0]).toBe(stopGrid.y);
});

test('test_is_collinear', () => {
    const startPoint2D = {x: 5, y: 2};
    const nextPoint2D = {x: 5, y: 4};
    const futurePoint2D = {x: 5, y: 10};
    expect(Tools.isCollinear(startPoint2D, nextPoint2D, futurePoint2D)).toBe(true);

    const testPoint2D1 = {x: 8, y: 10};
    expect(Tools.isCollinear(startPoint2D, nextPoint2D, testPoint2D1)).toBe(false);

    const startPoint3D = {x: 2, y: 2, z: 3};
    const nextPoint3D = {x: 2, y: 2, z: 6};
    const futurePoint3D = {x: 2, y: 2, z: 8};
    expect(Tools.isCollinear(startPoint3D, nextPoint3D, futurePoint3D)).toBe(true);

    const testPoint3D1 = {x: 2, y: 4, z: 10};
    expect(Tools.isCollinear(startPoint3D, nextPoint3D, testPoint3D1)).toBe(false);
});

test('test_refine_path_from_collinearity', () => {
    const zeroLengthsPath = Tools.refinePathFromCollinearity({ x: [], y: [] });
    expect(zeroLengthsPath).toBe(undefined);
    const zeroZLengthPath = Tools.refinePathFromCollinearity({ x: [1, 2, 3], y: [1, 1, 1], z: [] });
    expect(Number(zeroZLengthPath?.x.length)).toBe(2);
    const inconsistentLengthPath2D = Tools.refinePathFromCollinearity({ x: [1, 2, 3], y: [1, 1, 1, 1] });
    expect(inconsistentLengthPath2D).toBe(undefined);
    const inconsistentLengthPath3D = Tools.refinePathFromCollinearity({ x: [1, 2, 3], y: [1, 1, 1], z: [2] });
    expect(inconsistentLengthPath3D).toBe(undefined);

    const nonDiagonalPath2DLastThreeCollinear = {
        x: [12, 12, 11, 11, 11, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1],
        y: [ 0,  1,  1,  2,  3,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5]
    }; //    o   o   o           o                              o  o
    const refinedNonDiagonalPath2DLastThreeCollinear = Tools.refinePathFromCollinearity(nonDiagonalPath2DLastThreeCollinear, true);
    // console.log(refinedNonDiagonalPath2DLastThreeCollinear);
    expect(Number(refinedNonDiagonalPath2DLastThreeCollinear?.x.length)).toBe(6);
    
    const nonDiagonalPath2D = {
        x: [12, 12, 11, 11, 11, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1,  1,  1],
        y: [ 0,  1,  1,  2,  3,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9, 10, 11]
    }; //    o   o   o           o                              o                      o
    const refinedNonDiagonalPath2D = Tools.refinePathFromCollinearity(nonDiagonalPath2D, true);
    // console.log(refinedNonDiagonalPath2D);
    expect(Number(refinedNonDiagonalPath2D?.x.length)).toBe(6);

    const nonDiagonalPath = {
        x: [5, 5, 5, 4, 3, 3, 3, 3, 3, 3, 4, 4, 5, 5],
        y: [9, 8, 7, 7, 7, 6, 5, 4, 3, 2, 2, 1, 1, 0],
        z: [2, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 4, 4]
    }; //   o     o     o     o     o  o  o  o  o  o
    const refinedNonDiagonalPath = Tools.refinePathFromCollinearity(nonDiagonalPath, true);
    // console.log(refinedNonDiagonalPath);
    expect(Number(nonDiagonalPath.x.length)).toBe(14);
    expect(Number(refinedNonDiagonalPath?.x.length)).toBe(10);

    const diagonalPath = {
        x: [5, 5, 4, 3, 3, 3, 4, 4, 5, 5, 5],
        y: [9, 8, 7, 6, 5, 4, 3, 2, 3, 2, 1],
        z: [2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4]
    }; //   o  o     o     o  o  o  o     o
    const refinedDiagonalPath = Tools.refinePathFromCollinearity(diagonalPath, true);
    // console.log(refinedDiagonalPath);
    expect(Number(diagonalPath.x.length)).toBe(11);
    expect(Number(refinedDiagonalPath?.x.length)).toBe(8);
});
