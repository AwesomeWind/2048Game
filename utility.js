/**
 * 2048数组合并的工具函数
 * @param {Array<Array>} matrix
 * @param {String} direction
 * @return {Array<Array>}
 */
export function merge(matrix, direction) {
  switch (direction) {
    case "right":
      return matrix.map((row) => mergeRight(row));
    case "left":
      const inverted = reverseMatrix(matrix, "h");
      const mergedLeft = inverted.map((row) => mergeRight(row));
      return reverseMatrix(mergedLeft, "h");
    case "up":
      const rotated = rotateMatrix(matrix, 90);
      const mergedUp = rotated.map((row) => mergeRight(row));
      return rotateMatrix(mergedUp, -90);
    case "down":
      const rotatedDown = rotateMatrix(matrix, -90);
      const mergedDown = rotatedDown.map((row) => mergeRight(row));
      return rotateMatrix(mergedDown, 90);
  }
  return matrix;
}

/**
 * 将数组向右合并，遇到相同值会合并
 * @param {Array} row
 * @return {Array}
 */
export function mergeRight(row) {
  // 先将非零元素移到右侧
  let result = row.filter((num) => num !== 0);

  // 合并相同元素
  for (let i = result.length - 1; i > 0; i--) {
    //如果值已经等于2048，则不再合并
    if (result[i] === 2048) {
      continue;
    }
    if (result[i] === result[i - 1]) {
      result[i] *= 2;
      result[i - 1] = 0;
    }
  }

  // 再次过滤掉零并补齐左侧的空位
  result = result.filter((num) => num !== 0);
  while (result.length < row.length) {
    result.unshift(0);
  }

  return result;
}

/**
 * 用于逆置矩阵的工具函数
 * @param {Array<Array>} matrix - 二维数组矩阵
 * @param {"h" | "v"} direction - 逆置方向（"h" = "horizontal" 水平，"v" = "vertical" 垂直）
 * @return {Array<Array>} - 逆置后的矩阵
 */
export function reverseMatrix(matrix, direction) {
  const n = matrix.length;
  const m = matrix[0].length;
  const result = matrix.map((row) => [...row]); // 创建矩阵的深拷贝

  if (direction === "h") {
    // 水平逆置：左右对称翻转
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < Math.floor(m / 2); j++) {
        [result[i][j], result[i][m - 1 - j]] = [result[i][m - 1 - j], result[i][j]];
      }
    }
  } else if (direction === "v") {
    // 垂直逆置：上下对称翻转
    for (let i = 0; i < Math.floor(n / 2); i++) {
      for (let j = 0; j < m; j++) {
        [result[i][j], result[n - 1 - i][j]] = [result[n - 1 - i][j], result[i][j]];
      }
    }
  } else {
    throw new Error("方向必须为 'h' 或 'v'");
  }

  return result;
}
/**
 * 用于旋转矩阵的工具函数
 * @param {Array<Array>} matrix - 二维数组矩阵
 * @param {90 | -90 | 180} angle - 旋转角度，正数表示顺时针，负数表示逆时针
 * @return {Array<Array>} - 旋转后的矩阵
 */
export function rotateMatrix(matrix, angle) {
  const n = matrix.length;
  const m = matrix[0].length;
  let result;

  if (Math.abs(angle) === 90) {
    result = Array.from({ length: m }, () => Array(n).fill(0));
    if (angle > 0) {
      // 顺时针90°
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          result[j][n - 1 - i] = matrix[i][j];
        }
      }
    } else {
      // 逆时针90°
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          result[m - 1 - j][i] = matrix[i][j];
        }
      }
    }
  } else if (angle === 180 || angle === -180) {
    result = Array.from({ length: n }, () => Array(m).fill(0));
    // 180° 旋转，顺逆时针结果一致
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        result[n - 1 - i][m - 1 - j] = matrix[i][j];
      }
    }
  } else {
    throw new Error("角度必须为 90, -90 或 180");
  }

  return result;
}

/**
 * 根据2048规则，在传入的矩阵中随机一个空位置生成一个新数字
 * @param {Array<Array>} matrix
 * @return {Array<Array>} - 更新后的矩阵
 */
export function generateNewValue(matrix) {
  // 找出所有空位置
  const emptyCells = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  // 如果没有空位，直接返回原矩阵
  if (emptyCells.length === 0) {
    return matrix;
  }

  // 随机选择一个空位置
  const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  // 随机生成2或4
  matrix[x][y] = Math.random() < 0.9 ? 2 : 4;

  return matrix;
}

/**
 * 用来开始游戏的方法
 */
export function startGame() { 
  let col;
  switch (document.body.getAttribute("data-difficulty-level")) {
    case "easy":
      col = 5;
      break;
    case "normal":
      col = 4;
      break;
    case "hard":
      col = 3;
      break;
    case "expert":
      col = 6;
      break;
  }
  let matrix = Array.from({ length: col }, () => Array.from({ length: col }, () => 0));
  matrix = generateNewValue(matrix);
  return matrix;
}


/**
 * 用来重置矩阵的方法
 */

/**
 * 用来判断游戏是否结束的方法
 */

/**
 * 游戏失败后的回调
 */

/**
 * 游戏目标达成后的回调
 */

/**
 * 用来统计得分的方法
 */
