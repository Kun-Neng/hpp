import {Grid} from './Grid';

export class Model {
    readonly _dimension: any;
    readonly _is2d: boolean;
    readonly _obstacleArray: Array<Grid>;
    readonly _startGrid: Grid;
    readonly _stopGrid: Grid;
    readonly _distX: number;
    readonly _distY: number;
    readonly _distZ: number;
    private _initQ: Map<string, any>;

    constructor(dimension: any, obstacleArray: Array<Grid>, waypoint: any) {
        this._dimension = dimension;
        this._is2d = Model.is2d(this._dimension);

        this._obstacleArray = obstacleArray;

        const start = waypoint.start;
        const stop = waypoint.stop;
        this._startGrid = new Grid(start.x, start.y, start.z, this._is2d);
        this._stopGrid = new Grid(stop.x, stop.y, stop.z, this._is2d);
        this._distX = this._stopGrid.x - this._startGrid.x;
        this._distY = this._stopGrid.y - this._startGrid.y;
        this._distZ = this._stopGrid.z - this._startGrid.z;

        this._initQ = new Map<string, any>();
    }

    static is2d(dimension: any): boolean {
        if (!dimension.hasOwnProperty("z")) {
            return true;
        }

        if (dimension.z <= 0) {
            return true;
        }

        return false;
    }

    static createObstacleArray(data: any, is2d: boolean): Array<Grid> {
        const obstacleArray = new Array<Grid>();

        if (Object.keys(data).length === 0 || data.size === 0) {
            return obstacleArray;
        }

        const size = data.size;

        const xArray = data.x;
        const yArray = data.y;

        if (is2d) {
            for (let i = 0; i < size; i++) {
                obstacleArray.push(new Grid(xArray[i], yArray[i]));
            }
        } else {
            const zArray = data.z;
            for (let i = 0; i < size; i++) {
                obstacleArray.push(new Grid(xArray[i], yArray[i], zArray[i], is2d));
            }
        }

        return obstacleArray;
    }

    static gridsOnObstacles(array: Array<Grid>, grids: Array<Grid>): boolean {
        array.forEach(obstacle => {
            grids.forEach(grid => {
                if (grid.equal(obstacle)) {
                    console.log("the point is located on restricted region");
                    return true;
                }
            });
        });

        return false;
    }

    static isBoundaryAvailable(lowerBound: number, value: number, upperBound: number): boolean {
        if (value <= lowerBound) {
            console.log("value <= lower_bound");
            return false;
        }

        if (value >= upperBound) {
            console.log("value >= upper_bound");
            return false;
        }

        return (lowerBound + 1 < upperBound);
    }

    updateInitQ(row: number, col: number, z: number): void {
        const cellGrid = new Grid(row, col, z, this._is2d);

        let cellObj = {
            row,
            col,
            z,
            prev: undefined,
            dist: Number.MAX_SAFE_INTEGER,
            f: Number.MAX_SAFE_INTEGER
        };

        if (cellGrid.equal(this._startGrid)) {
            cellObj.dist = 0;
            cellObj.f = this._is2d ? cellObj.dist + Math.abs(this._distX) + Math.abs(this._distY) : cellObj.dist + Math.abs(this._distX) + Math.abs(this._distY) + Math.abs(this._distZ);
        }

        this._initQ.set(cellGrid.str(), cellObj);
    }

    createInitialQ(isFast: boolean): Map<string, any> {
        const x = Number(this._dimension.x);
        const y = Number(this._dimension.y);

        if (this._is2d) {
            for (let row = 0; row < x; row++) {
                for (let col = 0; col < y; col++) {
                    if (this._obstacleArray.findIndex((obstacle: Grid) => {
                        return (obstacle.x === row) && (obstacle.y === col);
                    }) !== -1) {
                        continue;
                    } else {
                        this.updateInitQ(row, col, 0);
                    }
                }
            }
        } else {
            const z = Number(this._dimension.z);

            if (isFast) {
                const fValue = Math.sqrt(this._distX * this._distX + this._distY * this._distY + this._distZ * this._distZ);

                this._initQ.set(this._startGrid.str(), {
                    row: this._startGrid.x,
                    col: this._startGrid.y,
                    z: this._startGrid.z,
                    prev: undefined,
                    dist: 0,
                    f: fValue
                });
            } else {
                for (let row = 0; row < x; row++) {
                    for (let col = 0; col < y; col++) {
                        for (let iz = 0; iz < z; iz++) {
                            if (this._obstacleArray.findIndex((obstacle: Grid) => {
                                return (obstacle.x === row) && (obstacle.y === col) && (obstacle.z === iz);
                            }) !== -1) {
                                continue;
                            } else {
                                this.updateInitQ(row, col, iz);
                            }
                        }
                    }
                }
            }
        }

        return this._initQ;
    }
}
