const body = document.body;
let header;
let main;

let userAnswers = [];
let correctAnswers = [];
let game = {
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  increaseCorrect: function() {
    this.correct++;
  },
  increaseIncorrect: function() {
    this.incorrect++;
  },
  increaseUnanswered: function(value) {
    this.unanswered += value;
  },
  getCorrect: function() {
    return this.correct;
  },
  getIncorrect: function() {
    return this.incorrect;
  },
  getUnanswered: function() {
    return this.unanswered;
  },
  reset: function() {
    this.correct = 0;
    this.incorrect = 0;
    this.unanswered = 0;
  }
};
let score = {
  gamesPlayed: 0,
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  increaseGamesPlayed: function() {
    this.gamesPlayed++;
  },
  increaseCorrect: function(correct) {
    this.correct += correct;
  },
  increaseIncorrect: function(incorrect) {
    this.incorrect += incorrect
  },
  increaseUnanswered: function(value) {
    this.unanswered += value;
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
  getUnanswered: function() {
    return this.unanswered;
  },
  getWinrate: function() {
    let totalQuestions = this.getCorrect() + this.getIncorrect() + this.getUnanswered();
    return Math.floor((this.getCorrect() / totalQuestions) * 100);
  }
};

init();

function init() {
  body.innerHTML = "";

  header = document.createElement("header");
  main = document.createElement("main");
  body.appendChild(header);
  body.appendChild(main);

  let menuBtn = document.createElement("button");
  menuBtn.setAttribute("class", "material-icons header__menu_button");
  menuBtn.textContent = "menu";
  header.appendChild(menuBtn);

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

  getQuestions().then(function(result) {
    let data = JSON.parse(result);

    if (data.response_code !== 0) {
      let error = document.createElement("h2");
      error.classList.add("main__error");
      error.textContent = "Could not get questions from server!";
      main.appendChild(error);
    } else {
      let questions = data.results;

      game.reset();

      let title = document.createElement("h2");
      title.classList.add("main__title");
      title.textContent = "Quiz " + (score.getGamesPlayed() + 1);
      main.appendChild(title);

      let qNumber = 0;
      let qAnswers = [];
      for (let question of questions) {
        qNumber++;

        let q = document.createElement("div");
        q.classList.add("question");

        let qText = document.createElement("p");
        qText.classList.add("question__text");
        qText.textContent = "Q" + qNumber + ". " + decode(question.question);
        q.appendChild(qText);

        correctAnswers.push(decode(question.correct_answer));
        qAnswers.push(decode(question.correct_answer));
        for (let incorrect of question.incorrect_answers) {
          qAnswers.push(decode(incorrect));
        }

        while (qAnswers.length > 0) {
          let i = Math.floor(Math.random() * qAnswers.length);

          let container = document.createElement("div");
          container.classList.add("question__container");

          let answer = document.createElement("input");
          answer.classList.add("question__answer");
          answer.id = qAnswers[i];
          answer.type = "radio";
          answer.name = "q" + qNumber;
          answer.dataset.pos = qNumber - 1;
          answer.value = qAnswers[i];
          container.appendChild(answer);

          let label = document.createElement("label");
          label.classList.add("question__answerText")
          label.textContent = qAnswers[i];
          label.for = qAnswers[i];
          container.appendChild(label);

          q.appendChild(container);
          qAnswers.splice(i, 1);
        }

        qAnswers = [];

        main.appendChild(q);
      }

      let submit = document.createElement("button");
      submit.classList.add("main__submit");
      submit.textContent = "SUBMIT!";
      submit.addEventListener("click", results);
      main.appendChild(submit);
    }
  });
}

function getQuestions() {
  return new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open("GET", "https://opentdb.com/api.php?amount=10&type=multiple");
    req.onload = function() {
      resolve(req.responseText);
    };
    req.send();
  });
}

function results() {
  let answers = document.querySelectorAll(".question__answer:checked");

  score.increaseGamesPlayed();

  game.increaseUnanswered(correctAnswers.length - answers.length);
  score.increaseUnanswered(game.getUnanswered());

  for (let answer of answers) {
    if (answer.value === correctAnswers[answer.dataset.pos]) {
      game.increaseCorrect();
    } else {
      game.increaseIncorrect();
    }
  }

  createDialog();
}

function createDialog() {
  let dialogContainer = document.createElement("div");
  dialogContainer.classList.add("container");

  let bg = document.createElement("div");
  bg.classList.add("container__bg");
  dialogContainer.appendChild(bg);

  let dialog = document.createElement("div");
  dialog.classList.add("dialog");

  let dialogTitle = document.createElement("h2");
  dialogTitle.classList.add("dialog__title");
  let correct = game.getCorrect();
  if (correct >= 8) {
    dialogTitle.textContent = "Congratulations!";
  } else if (correct >= 5 && correct < 8) {
    dialogTitle.textContent = "Nice try!";
  } else if (correct >= 3 && correct < 5) {
    dialogTitle.textContent = "You can better!";
  } else {
    dialogTitle.textContent = "Unlucky!";
  }
  dialog.appendChild(dialogTitle);

  let dialogText = document.createElement("p");
  dialogText.classList.add("dialog__text");
  dialogText.textContent = `You answered ${correct}/10 questions correct!`;
  dialog.appendChild(dialogText);

  let buttons = document.createElement("div");
  buttons.classList.add("dialog__buttons");
  dialog.appendChild(buttons);

  let restart = document.createElement("button");
  restart.classList.add("dialog__re_start");
  restart.textContent = "RE-START";
  restart.addEventListener("click", function() {
    body.removeChild(body.lastChild);
    start();
  });
  buttons.appendChild(restart);

  let close = document.createElement("button");
  close.classList.add("dialog__close");
  close.textContent = "CLOSE";
  close.addEventListener("click", function() {
    body.removeChild(body.lastChild);
    init();
  });
  buttons.appendChild(close);

  dialogContainer.appendChild(dialog);
  body.appendChild(dialogContainer);
}

function decode(input) {
  let doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}