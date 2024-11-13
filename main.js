import {
  generateNewValue,
  startGame,
  merge,
  calculateScore,
} from "./utility.js";

const pageHomeNode = document.body.querySelector(".home");
const pageGameNode = document.body.querySelector(".game");
const headerMenuNode = document.querySelector(".header");
const menuNode = pageHomeNode.querySelector(".menu");
const scoreNumberNode = pageGameNode.querySelector(".score-number");
const gameContentNode = pageGameNode.querySelector(".content");
const TRANSITION_DURATION = 300;
let matrix;
/**
 * 主程序
 */
(function () {
  menuNode.addEventListener("click", (event) => {
    // 只有点击到 button 元素时才处理事件
    const buttonNode = event.target.closest("button"); // 使用 closest 判断是否点击的是 button
    if (!buttonNode) return; // 如果不是 button，则返回，不做处理

    let difficultyLevel = buttonNode.getAttribute("data-difficulty-level");
    if (
      difficultyLevel &&
      difficultyLevel !== document.body.getAttribute("data-difficulty-level")
    ) {
      document.body.setAttribute("data-difficulty-level", difficultyLevel);
    }
    document.body.setAttribute("data-page", "game");
    restartGame();
  });
  headerMenuNode.addEventListener("click", (event) => {
    // 只有点击到 button 元素时才处理事件
    const buttonNode = event.target.closest("button"); // 使用 closest 判断是否点击的是 button
    if (!buttonNode) return; // 如果不是 button，则返回，不做处理

    switch (buttonNode.id) {
      case "restart":
        restartGame();
        break;
      case "back-to-home":
        document.body.setAttribute("data-page", "home");
        break;
    }
  });
})();

function restartGame() {
  unregisterEvent();
  matrix = startGame();
  generateBlocksFromMatrix(matrix);
  registerEvent();
}
function updateBlocksFromMatrix(matrix) {
  const blocks = gameContentNode.querySelectorAll(".block");
  const flatMatrix = matrix.flat(); // 将二维数组打平为一维数组
  flatMatrix.forEach((value, index) => {
    blocks[index].setAttribute("data-number", value || "");
  });
}

function updateScoreNumber(oldMatrix, newMatrix) {
  const oldScore = scoreNumberNode.getAttribute("data-score-number");
  const score = calculateScore(oldMatrix, newMatrix);
  if (score) {
    scoreNumberNode.setAttribute("data-score-number", +oldScore + score);
    const pNode = document.createElement("p");
    pNode.innerText = `+${score}`;
    pNode.classList.add("score-animation");
    pNode.addEventListener("animationend", () => {
      pNode.remove();
    });
    scoreNumberNode.appendChild(pNode);
  }
}

function generateBlocksFromMatrix(matrix) {
  while (gameContentNode.firstChild) {
    gameContentNode.removeChild(gameContentNode.firstChild);
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const blockNode = document.createElement("div");
      blockNode.className = "block";
      blockNode.setAttribute("data-number", matrix[i][j] || "");
      gameContentNode.appendChild(blockNode);
    }
  }
}
const debounce = (func, wait) => {
  let timer;
  return function (...args) {
    if (!timer) {
      func.apply(this, args); // 第一次立即执行
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null; // 清除计时器
    }, wait);
  };
};

const matrixMoveUp = debounce(() => {
  const mergeMatrix = merge(matrix, "up");
  updateScoreNumber(matrix, mergeMatrix);
  matrix = generateNewValue(mergeMatrix);
  updateBlocksFromMatrix(matrix);
}, TRANSITION_DURATION);

const matrixMoveDown = debounce(() => {
  const mergeMatrix = merge(matrix, "down");
  updateScoreNumber(matrix, mergeMatrix);
  matrix = generateNewValue(mergeMatrix);
  updateBlocksFromMatrix(matrix);
}, TRANSITION_DURATION);

const matrixMoveLeft = debounce(() => {
  const mergeMatrix = merge(matrix, "left");
  updateScoreNumber(matrix, mergeMatrix);
  matrix = generateNewValue(mergeMatrix);
  updateBlocksFromMatrix(matrix);
}, TRANSITION_DURATION);

const matrixMoveRight = debounce(() => {
  const mergeMatrix = merge(matrix, "right");
  updateScoreNumber(matrix, mergeMatrix);
  matrix = generateNewValue(mergeMatrix);
  updateBlocksFromMatrix(matrix);
}, TRANSITION_DURATION);

let moveStartLocation;
let moveEndLocation;
/**
 * 辅助函数，传入起始位置和结束位置，返回移动方向
 * @param {{x: number, y: number}} start 起始位置坐标
 * @param {{x: number, y: number}} end 结束位置坐标
 * @returns {string} 移动方向，可为 "up"、"down"、"left" 或 "right"
 */
function getDirection(start, end) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平移动为主
    return deltaX > 0 ? "right" : "left";
  } else {
    // 垂直移动为主
    return deltaY > 0 ? "down" : "up";
  }
}
/**
 * 为gameContentNode节点注册事件
 * 监听鼠标滑动事件：分为上滑、下滑、左滑、右滑四种情况
 * 监听鼠标方向键触发事件：分为上下左右四个方向
 * 监听拖动事件：分别为向上、向下、向左、向右四个方向
 */
function registerEvent() {
  gameContentNode.addEventListener("touchstart", handleTouchStart);
  gameContentNode.addEventListener("touchend", handleTouchEnd);
  gameContentNode.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("keydown", handleKeyDown);
}
/**
 * 注销gameContentNode节点注册事件
 */
function unregisterEvent() {
  gameContentNode.removeEventListener("touchstart", handleTouchStart);
  gameContentNode.removeEventListener("touchend", handleTouchEnd);
  gameContentNode.removeEventListener("mousedown", handleMouseDown);
  window.removeEventListener("mouseup", handleMouseUp);
  window.removeEventListener("keydown", handleKeyDown);
}

function handleTouchStart(event) {
  startMove(event);
}

function handleTouchEnd(event) {
  endMove(event);
}

function startMove(event) {
  event.preventDefault();
  let startLocation;
  //判断传入的event是touch还是mouse事件
  if (event.touches) {
    startLocation = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  } else {
    startLocation = {
      x: event.clientX,
      y: event.clientY,
    };
  }
  moveStartLocation = startLocation;
}

function endMove(event) {
  event.preventDefault();
  let endLocation;
  //判断传入的event是touch还是mouse事件
  if (event.changedTouches) {
    endLocation = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  } else {
    endLocation = {
      x: event.clientX,
      y: event.clientY,
    };
  }
  window.removeEventListener("mouseup", handleMouseUp);
  moveEndLocation = endLocation;
  const direction = getDirection(moveStartLocation, moveEndLocation);
  handleMarginMatrix(direction);
}
function handleMarginMatrix(direction) {
  switch (direction) {
    case "up":
      matrixMoveUp();
      break;
    case "down":
      matrixMoveDown();
      break;
    case "left":
      matrixMoveLeft();
      break;
    case "right":
      matrixMoveRight();
      break;
  }
}

function handleMouseDown(event) {
  startMove(event);
  window.addEventListener("mouseup", handleMouseUp);
}

function handleMouseUp(event) {
  endMove(event);
}
function handleKeyDown(event) {
  event.preventDefault();
  let direction;
  switch (event.key) {
    case "ArrowUp":
    case "w":
      direction = "up";
      break;
    case "ArrowDown":
    case "s":
      direction = "down";
      break;
    case "ArrowLeft":
    case "a":
      direction = "left";
      break;
    case "ArrowRight":
    case "d":
      direction = "right";
      break;
    default:
      return;
  }
  handleMarginMatrix(direction);
}
