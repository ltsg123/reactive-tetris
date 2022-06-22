import { Point2D, Scene } from './types';

export const COLS = 25;
export const ROWS = 40;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);

function renderBackground (ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#EEE';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawText (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fillStyle: string,
  fontSize: number, horizontalAlign: CanvasTextAlign = 'center', verticalAlign: CanvasTextBaseline = 'middle') {

  ctx.fillStyle = fillStyle;
  ctx.font = `bold ${fontSize}px sans-serif`;

  let textX = x;
  let textY = y;

  ctx.textAlign = horizontalAlign;
  ctx.textBaseline = verticalAlign;

  ctx.fillText(text, textX, textY);
}

export function createCanvasElement (width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function renderScene (ctx: CanvasRenderingContext2D, scene: Scene) {
  renderBackground(ctx);
  renderScore(ctx, scene.score);
  renderBlock(ctx, scene.block);
  renderLeftoverBlocks(ctx, scene.leftoverBlocks);
}

export function renderScore (ctx: CanvasRenderingContext2D, score: number) {
  let textX = CANVAS_WIDTH / 2;
  let textY = CANVAS_HEIGHT / 2;

  drawText(ctx, score.toString(), textX, textY, 'rgba(0, 0, 0, 0.1)', 150);
}

export function renderBlock (ctx: CanvasRenderingContext2D, blocks: Array<Point2D>) {
  blocks.forEach(block => paintCell(ctx, block, 'red'));
}

export function renderLeftoverBlocks (ctx: CanvasRenderingContext2D, blocks: Array<Point2D>) {
  blocks.forEach(block => paintCell(ctx, block, 'black'));
}

export function renderGameOver (ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let textX = CANVAS_WIDTH / 2;
  let textY = CANVAS_HEIGHT / 2;

  drawText(ctx, 'GAME OVER!', textX, textY, 'black', 25);
}

export function renderStop (ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let textX = CANVAS_WIDTH / 2;
  let textY = CANVAS_HEIGHT / 2;

  drawText(ctx, 'GAME STOP!', textX, textY, 'black', 25);
}

function paintCell (ctx: CanvasRenderingContext2D, point: Point2D, color: string) {
  const x = point.x * CELL_SIZE + (point.x * GAP_SIZE);
  const y = point.y * CELL_SIZE + (point.y * GAP_SIZE);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}