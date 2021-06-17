export class Grid {
    readonly _x: number;
    readonly _y: number;
    private _z: number;
    private _is2d: boolean;

    constructor(x: number, y: number, z?: number | undefined) {
        this._x = x;
        this._y = y;
        this._z = typeof z === 'number' ? z : 0;
        this._is2d = typeof z === 'number' ? false : true;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get z(): number {
        return this._z;
    }

    get is2d(): boolean {
        return this._is2d;
    }

    str(): string {
        return this._is2d ? `${this._x},${this._y}` :
            `${this._x},${this._y},${this._z}`;
    }

    equal(other: Grid): boolean {
        return this.str() === other.str();
    }

    shift(x: number, y: number, z: number = 0): Grid {
        if (this._is2d) {
            return new Grid(this._x + x, this._y + y);
        } else {
            return new Grid(this._x + x, this._y + y, this._z + z);
        }
    }

    isOutOfBound({boundX = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], boundY = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], boundZ = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]}: {boundX?: number[], boundY?: number[], boundZ?: number[]}): boolean {
        const minX = Math.min(...boundX);
        const maxX = Math.max(...boundX);
        const minY = Math.min(...boundY);
        const maxY = Math.max(...boundY);

        if (this._is2d) {
            return this._x <= minX || this._x >= maxX || this._y <= minY || this._y >= maxY;
        } else {
            const minZ = Math.min(...boundZ);
            const maxZ = Math.max(...boundZ);
            return this._x <= minX || this._x >= maxX || this._y <= minY || this._y >= maxY || this._z <= minZ || this._z >= maxZ;
        }
    }
}
