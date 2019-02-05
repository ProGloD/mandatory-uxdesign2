const body = document.body;
const header = document.querySelector("header");
const main = document.querySelector("main");

let userAnswers = [];
let correctAnswers = [];
let game = {
  correct: 0,
  incorrect: 0,
  increaseCorrect: function() {
    this.correct++;
  },
  increaseIncorrect: function() {
    this.incorrect++;
  },
  getCorrect: function() {
    return this.correct;
  },
  getIncorrect: function() {
    return this.incorrect;
  },
  reset: function() {
    this.correct = 0;
    this.incorrect = 0;
  }
};
let score = {
  gamesPlayed: 0,
  correct: 0,
  incorrect: 0,
  increaseGamesPlayed: function() {
    this.gamesPlayed++;
  },
  increaseCorrect: function(correct) {
    this.correct += correct;
  },
  increaseIncorrect: function(incorrect) {
    this.incorrect += incorrect
  },
  getGamesPlayed: function() {
    return this.gamesPlayed;
  },
  getCorrect: function() {
    return this.correct;
  },
  getIncorrect: function() {
    return this.incorrect;
  },
  getWinrate: function() {
    let totalAnswers = this.getCorrect() + this.getIncorrect();
    return Math.floor((this.getCorrect() / totalAnswers) * 100);
  }
};

init();

function init() {
  header.innerHTML = "";
  main.innerHTML = "";

  let h1 = document.createElement("h1");
  h1.classList.add("header__title");
  h1.textContent = "Quiz Master";
  header.appendChild(h1);

  let startBtn = document.createElement("button");
  startBtn.classList.add("main__startQuiz");
  startBtn.textContent = "START QUIZ";
  startBtn.addEventListener("click", start);
  main.appendChild(startBtn);
}

function start() {
  main.innerHTML = "";

  new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open("GET", "https://opentdb.com/api.php?amount=10&type=multiple");
    req.onload = function() {
      resolve(req.responseText);
    };
    req.send();
  }).then(function(result) {
    let data = JSON.parse(result);

    if (data.response_code !== 0) {
      let error = document.createElement("h2");
      error.classList.add("main__error");
      error.textContent = "Could not get questions from server!";
      main.appendChild(error);
    } else {
      let questions = data.results;

      game.reset();

      score.increaseGamesPlayed();
      let title = document.createElement("h2");
      title.classList.add("main__title");
      title.textContent = "Quiz " + score.getGamesPlayed();
      main.appendChild(title);

      let qNumber = 0;
      let qAnswers = [];
      for (let question of questions) {
        qNumber++;

        let q = document.createElement("div");
        q.classList.add("question");

        let qText = document.createElement("p");
        qText.classList.add("question__text");
        qText.textContent = "Q" + qNumber + ". " + question.question;
        q.appendChild(qText);

        correctAnswers.push(question.correct_answer);
        qAnswers.push(question.correct_answer);
        for (let incorrect of question.incorrect_answers) {
          qAnswers.push(incorrect);
        }

        while (qAnswers.length > 0) {
          let i = Math.floor(Math.random() * qAnswers.length);

          let container = document.createElement("div");
          container.classList.add("question__container");

          let answer = document.createElement("input");
          answer.classList.add("question__answer");
          answer.type = "radio";
          answer.name = "q" + qNumber;
          answer.value = qAnswers[i];
          container.appendChild(answer);

          let label = document.createElement("label");
          label.classList.add("question__answerText")
          label.textContent = qAnswers[i];
          container.appendChild(label);

          q.appendChild(container);
          qAnswers.splice(i, 1);
        }

        qAnswers = [];

        main.appendChild(q);
      }
    }
  });
}