# RxJS 游戏之俄罗斯方块

---

> 贪吃蛇链接：https://github.com/RxJS-CN/rxjs-articles-translation/blob/master/articles/TAMING-SNAKES-WITH-REACTIVE-STREAMS.md

受网上 RxJS 贪吃蛇的启发，尝试写一个练手，恰逢女友喜欢俄罗斯方块，因而有了这篇文章。

## 目录

---

- [游戏概览](#游戏概览)

- [设置游戏区域](#设置游戏区域)

## 游戏概览

---

我将重新打造一款俄罗斯方块游戏，还是由 7 种图形（"O","I","S","Z","L","J","T"）组成，不同的是，这次所有图形都有两种配色（注：不存在一个图形有两个颜色），这样设计的初衷只是为了新增一个彩蛋效应 --- 如果实现单层同色，可实现全屏清除。

### 具体步骤：

将区域上面出现的图形合理地平铺到容器底部，当出现一行完全铺满，则会消去该行；如果铺满且同色，则会消去所有图形；记分方式通过消去的格子计算；

## 设置游戏区域

---

在开始游戏前，首先要创建

## 确定源头流

---

大致罗列游戏所需要的功能：

- 生成随机方块
- 用按键控制方块左右移动和快速下落
- 按键空格/点击控制旋转
- 记录方块(包括碰撞和消除)

## 方块生成

---

方块的组成，除了外部形式 4 个可见像素点以外，还有一个关键的隐藏点（中心点）—— 方块旋转变化时作参照

方块一般 7 种情况（"O","I","S","Z","L","J","T"），有固定的点集：

```typescript

```

## 方块操作

---

方块有四个操作：移动（左右）、快速下落、向上旋转（顺时针且保证旋转一周回到原地）;

### 移动

需求是方块下落过程中可以调整左右的位置，使其可以下落在合适的位置；("⬅️"，“➡️”，“A” , "D")

```typescript
// 移动参数
export const MOVE_DIRECTIONS = {
  37: { x: -1, y: 0 },
  39: { x: 1, y: 0 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
};

// main
let move$ = keydown$.pipe(
  map((event: KeyboardEvent) => MOVE_DIRECTIONS[event.keyCode]),
  filter((direction) => !!direction)
);
```

### 快速下落

方块默认速度是单方格移动，如果想要加快游戏的进展，自然需要提速 😜

```typescript

```

- 快速下落
- 向上旋转

## 底部边界

---

俄罗斯方块底部自然是要设置边界的，不然也玩不下去 🤣，不知道以前的版本如何，我打算左右不留边界，可以正常跨界。

**边界的作用：**防止俄罗斯方块脱离容器，方块触碰到边界就会失去活性（即不能移动），利用某种算法，生成一个新的边界。

接下来句要分析边界的变化：

初始的时候，以容器的底部为边界，利用全局常量列长来生成一个个点，组成边界的集合：

```typescript
// canvas
export const COLS = 200;

// constant
export const INITIAL_SCENE_BOTTOM_BORDER = [...new Array(COLS).keys()].map(
  (x) =>
    Object.assign(
      {},
      {
        x: x,
        y: 0,
      }
    )
);
```

过程中，当方块触碰到边界时，首先让方块失去活性，成为边界，同时轮询方块所设计的每一行，判断是否需要消去（即用户得分），最后再生成一个新的边界。

得分算法（消去方格）：

```typescript
// 更新容器底部边界
// utils
export function updateBorder(merge: Array<Point2D>, border: Array<Point2D>) {
  let mergeBorder = [...merge, ...border];
  const heights = Array.from(new Set(merge.map((point: Point2D) => point.y)));
  heights.forEach((height) => {
    const length = mergeBorder.filter(
      (point: Point2D) => point.y === height
    ).length;
    if (length === COLS) {
      mergeBorder = mergeBorder.filter((point: Point2D) => point.y !== height);
    }
  });

  return mergeBorder;
}

// main
let border$ = new BehaviorSubject<Array<Point2D>>(INITIAL_SCENE_BOTTOM_BORDER);

let sceneBottomBorder$ = border$.pipe(scan(updateBorder));

let score$ = sceneBottomBorder$.pipe(
  map((points) => points.length),
  scan((acc, curr) => acc + curr, 0)
);
```

结束时，当边界的最高点低于容器的上层边界（即 y<0），提示 GAME OVER；

## 方块移动

---

方块的移动选择
