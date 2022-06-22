import { interval } from 'rxjs/observable/interval';
import { of } from 'rxjs/observable/of';
import { filter, scan, startWith, switchMap, withLatestFrom, share, takeWhile, tap, map } from 'rxjs/operators';
import { CANVAS_HEIGHT, CANVAS_WIDTH, createCanvasElement, renderGameOver, renderScene, renderStop } from './canvas';
import { FASTDOWN_KEYDOWN, FPS, INIT_DOWN_RATE, MOVE_KEYDOWN, SPACE, SPEED, UPROTATE_KEYDOWN } from './constants';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import { Observable } from 'rxjs/Observable';
import { Point2D, Scene } from './types';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { generateBlocks, move, rotate, updateBorder } from './utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';

/**
 * Create canvas element and append it to the page
 */
const canvas = createCanvasElement(CANVAS_WIDTH, CANVAS_HEIGHT);
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

/**
 * Starting values
 */

// Initial speed of movement
let ticks$ = interval(SPEED);

let keydown$ = fromEvent(document, 'keydown');

function createGame (fps$: Observable<number>): Observable<Scene> {

  let stopState$ = new BehaviorSubject<boolean>(false);

  let stop$ = keydown$.pipe(
    map((event: KeyboardEvent) => SPACE[event.keyCode]),
    filter(direction => !!direction),
    tap(() => stopState$.next(!stopState$.value))
  );

  // 记录方块各种变化后的位置
  let blockPos$ = new BehaviorSubject<Array<Point2D>>(generateBlocks());

  // 记录方块底部边界
  const borderBlocks$ = new BehaviorSubject<Array<Point2D>>([]);

  // 方块快速下降
  let fastDown$ = keydown$.pipe(
    filter(() => !stopState$.value),
    map((event: KeyboardEvent) => FASTDOWN_KEYDOWN[event.keyCode]),
    filter(direction => !!direction)
  );

  // 方块初始下降--源流
  const block$: Observable<Array<Point2D>> = merge(ticks$, fastDown$, stop$).pipe(
    filter(() => !stopState$.value),
    withLatestFrom(blockPos$, borderBlocks$, (_, blockPos, border) => move(blockPos, INIT_DOWN_RATE, border)),
    tap((block) => blockPos$.next(block)),
    share()
  );

  // 方块左右移动源
  const move$: Observable<Array<Point2D>> = keydown$.pipe(
    filter(() => !stopState$.value),
    map((event: KeyboardEvent) => MOVE_KEYDOWN[event.keyCode]),
    filter(direction => !!direction),
    withLatestFrom(blockPos$, borderBlocks$, (_, blockPos, border) => move(blockPos, _, border)),
    share()
  );

  // 方块向上旋转
  let upRotate$: Observable<Array<Point2D>> = keydown$.pipe(
    filter(() => !stopState$.value),
    map((event: KeyboardEvent) => UPROTATE_KEYDOWN[event.keyCode]),
    filter(direction => !!direction),
    withLatestFrom(blockPos$, borderBlocks$, (_, blockPos, border) => rotate(blockPos, border)),
    tap((block) => blockPos$.next(block)),
    share()
  );

  let blockChanges$: Observable<Point2D[]> = merge(block$, move$, upRotate$);

  let sceneBottomBorder$ = block$.pipe(
    scan((border, blocks) => updateBorder(border, blocks, blockPos$), []),
    tap((border) => borderBlocks$.next(border)),
    share()
  );

  let score$ = sceneBottomBorder$.pipe(
    map(points => points.length),
    startWith(0),
    share()
  );

  let scene$: Observable<Scene> = combineLatest(blockChanges$, sceneBottomBorder$, score$, stopState$,
    (block: Point2D[], leftoverBlocks: Point2D[], score: number, stopState: boolean, _) => {
      return {
        block, leftoverBlocks, score, isStop: stopState
      };
    });

  return fps$.pipe(withLatestFrom(scene$, (_, scene) => scene));
}

function isGameOver (scene) {
  return scene.leftoverBlocks.some(item => item.y < 0);
}

let game$ = of('Start Game').pipe(
  map(() => interval(1000 / FPS, animationFrame)),
  switchMap(createGame),
  takeWhile(scene => !isGameOver(scene))
);

const startGame = () => game$.subscribe({
  next: (scene) => {
    renderScene(ctx, scene);
    scene.isStop && renderStop(ctx);
  },
  complete: () => {
    renderGameOver(ctx);
  }
});

startGame();