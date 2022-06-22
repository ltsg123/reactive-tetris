import { BehaviorSubject } from 'rxjs';
import { COLS, ROWS } from './canvas';
import { BLOCK } from './constants';
import { Point2D } from './types';

/**
 * @description 左右移动方块
 * @author xiaoshumin
 * @date 2022-06-22
 * @export
 * @param {Array<Point2D>} blocks
 * @param {Point2D} direction
 * @return {*}
 */
export function move (blocks: Array<Point2D>, direction: Point2D, border: Array<Point2D>) {
  const result = Array.from(blocks);
  for (const iteroter of result) {
    iteroter.x += 1 * direction.x;
    iteroter.y += 1 * direction.y;
    if (iteroter.x < 0) {
      iteroter.x += COLS;
    } else if (iteroter.x > COLS - 1) {
      iteroter.x -= COLS;
    }
  }
  if (isImpactBorder(border, result)) {
    console.log('阻止----');
  }

  return isImpactBorder(border, result) ? blocks : result;
}

/**
 * @description 顺时针旋转90度
 * @author xiaoshumin
 * @date 2022-06-22
 * @export
 * @param {Array<Point2D>} blocks
 * @return {*}
 */
export function rotate (blocks: Array<Point2D>, border: Array<Point2D>) {
  if (blocks[0].x === blocks[3].x && blocks[1].x === blocks[2].x && blocks[0].y === blocks[1].y) {
    return blocks;
  }
  const refPoint = blocks[1];
  const resultBlocks: Array<Point2D> = [];
  blocks.forEach((block, index) => {
    if (index === 1) {
      resultBlocks.push(block);
    } else {
      // 旋转函数
      // x=(x1-x2)cosθ-(y1-y2)sinθ+x2
      // y=(y1-y2)cosθ+(x1-x2)sinθ+y2
      const x = (block.x - refPoint.x) * 0 - (block.y - refPoint.y) * 1 + refPoint.x;
      const y = (block.y - refPoint.y) * 0 + (block.x - refPoint.x) * 1 + refPoint.y;
      resultBlocks.push({ x, y });
    }
  });

  return isImpactBorder(border, resultBlocks) ? blocks : resultBlocks;
}

export function initBlocks () {
  const maxNum = Object.keys(BLOCK).length - 1;
  const randomNum = parseInt(Math.random() * (maxNum + 1) + '', 10);

  return Array.from(BLOCK[randomNum]);
}

export function generateBlocks (blocks?: Array<Point2D>) {
  const maxNum = Object.keys(BLOCK).length - 1;
  const randomNum = parseInt(Math.random() * (maxNum + 1) + '', 10);
  const xRandom = parseInt(Math.random() * (COLS + 1) + '', 10);

  return Array.from(blocks ?? BLOCK[randomNum], (v) => Object.assign({}, {
    x: v.x + xRandom,
    y: v.y
  }));
}

export function isImpactBorder (border: Array<Point2D>, blocks: Array<Point2D>) {
  return border.some(item => blocks.some(block => block.y >= ROWS) || blocks.includes(item));
}

/**
 * @description 更新容器底部边界
 * @author xiaoshumin
 * @date 2022-04-27
 * @export
 * @param {Array<Point2D>} merge
 * @param {Array<Point2D>} border
 */
export function updateBorder (border: Array<Point2D>, merge: Array<Point2D>, blockPos$: BehaviorSubject<Point2D[]>, nextBlock?: Array<Point2D>) {
  const blocks = monitorBlocksTouchBottom(border, merge);
  if (blocks.length > 0) {
    let mergeBorder = [...blocks, ...border];
    const heights = Array.from(new Set(blocks.map((point: Point2D) => point.y)));
    heights.forEach(height => {
      const length = mergeBorder.filter((point: Point2D) => point.y === height).length;
      if (length === COLS) {
        mergeBorder = mergeBorder.filter((point: Point2D) => point.y !== height);
        mergeBorder = mergeBorder.map((point: Point2D) => {
          if (point.y < height) {
            return {
              x: point.x,
              y: point.y + 1
            };
          }
          return point;
        });
      }
    });
    blockPos$.next(generateBlocks());
    return mergeBorder;
  }

  return border;
}

/**
 * @description 获取方块的最低点
 * @author xiaoshumin
 * @date 2022-04-28
 * @export
 * @param {Array<Point2D>} blocks
 */
export function getLowestPoint (blocks: Array<Point2D>) {
  const lowestPoints = [blocks[0]];
  blocks.slice(1).forEach(block => {
    if (block.y > lowestPoints[0].y) {
      lowestPoints.length = 0;
      lowestPoints.push(block);
    } else if (block.y === lowestPoints[0].y) {
      lowestPoints.push(block);
    }
  });
  return lowestPoints;
}

/**
 * @description 判断方块是否触底
 * @author xiaoshumin
 * @date 2022-04-28
 * @export
 * @param {Array<Point2D>} blocks
 * @param {Array<Point2D>} border
 */
export function monitorBlocksTouchBottom (border: Array<Point2D>, blocks: Array<Point2D>) {
  if (blocks.length === 0) {
    return [];
  }
  const isTouched = blocks.some(block => block.y === ROWS - 1 || border.find(item => item.x === block.x && item.y === block.y + 1));

  return isTouched ? blocks : [];
}
