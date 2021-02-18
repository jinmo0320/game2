const database = firebase.database();

export const readHighScores = (amount, f) => {
  database
    .ref("highscores")
    .orderByValue()
    .limitToLast(amount)
    .on("value", (data) => {
      f(data.val());
    });
};

export const writeUserData = (score) => {
  const userId = window.user.displayName;
  database.ref(`/highscores/${userId}`).set(score);
  // database.ref(`/highscores/${userId}`).set(score);
};
