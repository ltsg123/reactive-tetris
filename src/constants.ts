import { COLS } from './canvas';
import { Block, Directions } from './types';

export const FPS = 100;
export const SPEED = 500;

export const INITIAL_SCENE_BOTTOM_BORDER = [...new Array(COLS).keys()].
  map(x => Object.assign({}, {
    x: x,
    y: 0
  }));

export const INITIAL_POSITION = {
  x: COLS / 2,
  y: 0
};

// 初始下降流
export const INIT_DOWN_RATE = {
  x: 0,
  y: 1
};

// 移动参数 37 = ⬅️； 39 = ➡️；
// 参考： https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
export const MOVE_KEYDOWN = {
  37: { x: -1, y: 0 },
  39: { x: 1, y: 0 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 }
};

// 快速下降参数 40 = ⬇️
export const FASTDOWN_KEYDOWN = {
  40: true,
  S: true
};

// 暂停参数
export const SPACE = {
  32: true
};

// 向上旋转参数 38 = ⬆️
export const UPROTATE_KEYDOWN = {
  38: true,
  W: true
};

export const DIRECTIONS: Directions = {
  37: { x: -1, y: 0 },
  38: { x: 0, y: -1 },
  39: { x: 1, y: 0 },
  40: { x: 0, y: 1 }
};

export const BLOCK: Block = {
  // O
  0: [{ x: 0, y: -2 }, { x: 1, y: -2 }, { x: 1, y: -1 }, { x: 0, y: -1 }],
  // I
  1: [{ x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: -3 }, { x: 0, y: -4 }],
  // S
  2: [{ x: 2, y: -2 }, { x: 1, y: -2 }, { x: 1, y: -1 }, { x: 0, y: -1 }],
  // Z
  6: [{ x: 0, y: -2 }, { x: 1, y: -2 }, { x: 1, y: -1 }, { x: 2, y: -1 }],
  // L
  4: [{ x: 0, y: -3 }, { x: 0, y: -2 }, { x: 0, y: -1 }, { x: 1, y: -1 }],
  // J
  5: [{ x: 1, y: -3 }, { x: 1, y: -2 }, { x: 1, y: -1 }, { x: 0, y: -1 }],
  // T
  3: [{ x: 0, y: -2 }, { x: 1, y: -2 }, { x: 1, y: -1 }, { x: 2, y: -2 }]
};