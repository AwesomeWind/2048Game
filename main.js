
import {generateNewValue} from "./utility.js";

/**
 * 主程序
 */
(function () {
  const pageHomeNode = document.body.querySelector(".home");
  const pageGameNode = document.body.querySelector(".game");
  const menuNode = pageHomeNode.querySelector(".menu");
  const scoreNumberNode = pageGameNode.querySelector(".score-number");
  const gameContentNode = pageGameNode.querySelector(".content");
  menuNode.addEventListener("click", (event) => {
    // 只有点击到 button 元素时才处理事件
    const buttonNode = event.target.closest("button"); // 使用 closest 判断是否点击的是 button
    if (!buttonNode) return; // 如果不是 button，则返回，不做处理

    let difficultyLevel = buttonNode.getAttribute("data-difficulty-level");
    if (difficultyLevel && difficultyLevel !== document.body.getAttribute("data-difficulty-level")) {
      document.body.setAttribute("data-difficulty-level", difficultyLevel);
    }
    document.body.setAttribute("data-page", "game");
  });
  const headerMenuNode = document.querySelector(".header");
  headerMenuNode.addEventListener("click", (event) => {
    // 只有点击到 button 元素时才处理事件
    const buttonNode = event.target.closest("button"); // 使用 closest 判断是否点击的是 button
    if (!buttonNode) return; // 如果不是 button，则返回，不做处理

    switch (buttonNode.id) {
      case "restart":
        console.log("重新开始");
        break;
      case "back-to-home":
        document.body.setAttribute("data-page", "home");
        break;
    }
  });
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
  const matrix = Array.from({ length: col }, () => Array.from({ length: col }, () => 0));
  matrix = generateNewValue(matrix);
  console.log(matrix);
  
})();
