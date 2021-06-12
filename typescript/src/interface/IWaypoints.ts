export interface IWaypoints {
    start: { x: number, y: number, z?: number };
    stop: { x: number, y: number, z?: number };
    allowDiagonal?: boolean;
}
