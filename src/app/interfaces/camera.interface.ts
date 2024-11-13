export interface Camera {
    lightLevel: MinMax;
    subjectDistance: MinMax;
}

export interface MinMax {
    min: number;
    max: number;
}
