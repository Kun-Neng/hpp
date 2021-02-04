"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var Grid = /** @class */ (function () {
    function Grid(x, y, z, is2d) {
        if (z === void 0) { z = 0; }
        if (is2d === void 0) { is2d = true; }
        this._x = x;
        this._y = y;
        this._z = z;
        this._is2d = is2d;
    }
    Object.defineProperty(Grid.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "z", {
        get: function () {
            return this._z;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "is2d", {
        get: function () {
            return this._is2d;
        },
        enumerable: false,
        configurable: true
    });
    Grid.prototype.str = function () {
        return this._is2d ? this._x + "," + this._y :
            this._x + "," + this._y + "," + this._z;
    };
    Grid.prototype.equal = function (other) {
        return this._is2d ? this._x === other.x && this._y === other.y : this._x === other.x && this._y === other.y && this._z === other.z;
    };
    Grid.prototype.shift = function (x, y, z) {
        if (z === void 0) { z = 0; }
        return new Grid(this._x + x, this._y + y, this._z + z, this._is2d);
    };
    Grid.prototype.isOutOfBound = function (_a) {
        var _b = _a.boundX, boundX = _b === void 0 ? [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] : _b, _c = _a.boundY, boundY = _c === void 0 ? [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] : _c, _d = _a.boundZ, boundZ = _d === void 0 ? [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] : _d;
        return this._x <= boundX[0] || this._x >= boundX[1] || this._y <= boundY[0] || this._y >= boundY[1] || this._z <= boundZ[0] || this._z >= boundZ[1];
    };
    return Grid;
}());
exports.Grid = Grid;
