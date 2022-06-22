export interface Point2D {
  x: number;
  y: number;
}

export interface Directions {
  [key: number]: Point2D;
}

export enum Key {
  LEFT = 37,
  RIGHT = 39,
  UP = 38,
  DOWN = 40
}

export interface Scene {
  block: Array<Point2D>;
  leftoverBlocks: Array<Point2D>;
  score: number;
  nextBlocks?: Array<Point2D>;
  isStop?: boolean;
}

export interface Block {
  [key: number]: Array<Point2D>;
}

export enum BlockKey {
  O = 0,
  I = 1,
  S = 2,
  Z = 3,
  L = 4,
  J = 5,
  T = 6
}