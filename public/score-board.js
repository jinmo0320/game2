import { auth } from "./auth.js";
import { writeUserData, readHighScores } from "./database.js";

const container = document.querySelector(".score-board");
const loginBtn = document.querySelector(".start");

// 원하는 곳에 이벤트 걸어주시면 됩니다.
loginBtn.addEventListener("click", () => auth());

// readHighScores(amount: number, fn: (ranker: object) => void): void
readHighScores(5, (rankerObj) => {
  // 단순히 텍스트로만 해놨습니다 일단
  const rankers = Object.entries(rankerObj);
  let resultStr = "";
  rankers.forEach((ranker) => {
    resultStr += `${ranker[0]} : ${ranker[1]}\n`;
  });
  container.innerText = resultStr;
});

// writeUserData(score: number): void
window.writeData = function writeData(score) {
  writeUserData(score);
};
