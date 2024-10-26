export class Node {
  readonly _x: number;
  readonly _y: number;
  private _z: number;
  private _is2d: boolean;

  private _isObstacle: boolean;
  private _isNatural: boolean;
  private _isForced: boolean;

  private _prev: Node | undefined;
  private _dist: number;
  private _f: number;

  constructor(x: number, y: number, z?: number | undefined) {
    this._x = x;
    this._y = y;
    this._z = typeof z === 'number' ? z : 0;
    this._is2d = typeof z === 'number' ? false : true;

    this._isObstacle = false;
    this._isNatural = false;
    this._isForced = false;

    this._prev = undefined;
    this._dist = Number.MAX_SAFE_INTEGER;
    this._f = Number.MAX_SAFE_INTEGER;
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

  get isObstacle(): boolean {
    return this._isObstacle;
  }
  set isObstacle(value: boolean) {
    this._isObstacle = value;
  }

  get isNatural(): boolean {
    return this._isNatural;
  }
  set isNatural(value: boolean) {
    this._isNatural = value;
  }

  get isForced(): boolean {
    return this._isForced;
  }
  set isForced(value: boolean) {
    this._isForced = value;
  }

  public get prev(): Node | undefined {
    return this._prev;
  }
  public set prev(value: Node | undefined) {
    this._prev = value;
  }

  public get dist(): number {
    return this._dist;
  }
  public set dist(value: number) {
    this._dist = value;
  }

  public get f(): number {
    return this._f;
  }
  public set f(value: number) {
    this._f = value;
  }

  getCrux(crux: string): number {
    if (crux === 'dist') {
      return this._dist;
    } else if (crux === 'f') {
      return this._f;
    }
    return Number.MAX_SAFE_INTEGER;
  }

  setAsStartNode(): Node {
    this._dist = 0;

    return this;
  }

  str(): string {
    return this._is2d ? `${this._x},${this._y}` :
      `${this._x},${this._y},${this._z}`;
  }

  equal(other: Node): boolean {
    return this.str() === other.str();
  }

  shift(x: number, y: number, z: number = 0): Node {
    if (this._is2d) {
      return new Node(this._x + x, this._y + y);
    } else {
      return new Node(this._x + x, this._y + y, this._z + z);
    }
  }

  directionFrom(prevNode: Node): number[] {
    return this._is2d ? [Math.sign(this._x - prevNode.x), Math.sign(this._y - prevNode.y)] :
      [Math.sign(this._x - prevNode.x), Math.sign(this._y - prevNode.y), Math.sign(this._z - prevNode.z)];
  }

  stepDistanceTo(destNode: Node): number {
    const xSteps = Math.abs(destNode.x - this._x);
    const ySteps = Math.abs(destNode.y - this._y);
    // const xyStepDistances = Math.sqrt(2) * Math.min(xSteps, ySteps) + Math.abs(xSteps - ySteps);
    const xyStepDistances = Math.SQRT2 * Math.min(xSteps, ySteps) + Math.abs(xSteps - ySteps);

    if (this._is2d) {
      return xyStepDistances;
    } else {
      const zSteps = Math.abs(destNode.z - this._z);
      return xyStepDistances + zSteps;
    }
  }

  manhattanDistanceTo(destNode: Node): number {
    const distance = Math.abs(destNode.x - this._x) + Math.abs(destNode.y - this._y);
    return this._is2d ? distance : distance + Math.abs(destNode.z - this._z);
  }

  octileDistanceTo(destNode: Node): number {
    const dx = Math.abs(destNode.x - this._x);
    const dy = Math.abs(destNode.y - this._y);

    const factorD = Math.SQRT2 - 1;
    // const distance = factorD * (dx + dy) + (1 - 2 * factorD) * Math.min(dx, dy);
    const distance = (dy > dx) ? factorD * dx + dy : factorD * dy + dx;
    return this._is2d ? distance : distance + Math.abs(destNode.z - this._z);
  }

  distanceTo(destNode: Node): number {
    const distX = Math.abs(destNode.x - this._x);
    const distY = Math.abs(destNode.y - this._y);

    if (this._is2d) {
      return Math.sqrt(distX * distX + distY * distY);
    } else {
      const distZ = Math.abs(destNode.z - this._z);
      return Math.sqrt(distX * distX + distY * distY + distZ * distZ);
    }
  }

  isOutOfBound({ boundX = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], boundY = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], boundZ = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] }: { boundX?: number[], boundY?: number[], boundZ?: number[] }): boolean {
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
