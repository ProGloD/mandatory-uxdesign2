const main = document.querySelector(".main");
const start = document.querySelector(".main__button");

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

let data = [];
getData();
trapFocus(document.querySelector(".dialog"));

start.addEventListener("click", startQuiz);
document.querySelector(".main__submit").addEventListener("click", check);
document.querySelector(".restart").addEventListener("click", restart);
document.querySelector(".close").addEventListener("click", close);

function startQuiz() {
  document.querySelector(".main__questions-container").innerHTML = "";
  game.reset();

  if (start.classList.contains("main__button--visible") && !main.classList.contains("main--visible")) {
    start.classList.toggle("main__button--visible");
    main.classList.toggle("main--visible");
  }

  document.querySelector(".main__title").textContent = "Quiz " + (score.getGamesPlayed() + 1);

  createQuestions();

  getData();
}

function check() {
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

  showResult();
}

function showResult() {
  document.querySelector(".dialog").classList.add("dialog--visible");

  let correct = game.getCorrect();

  let dialogTitle = document.querySelector(".dialog__title");
  if (correct >= 8) {
    dialogTitle.textContent = "Congratulations!";
  } else if (correct >= 5 && correct < 8) {
    dialogTitle.textContent = "Nice try!";
  } else if (correct >= 3 && correct < 5) {
    dialogTitle.textContent = "You can better!";
  } else {
    dialogTitle.textContent = "Unlucky!";
  }

  document.querySelector(".dialog__content").textContent = `You answered ${correct}/10 questions correct!`;
}

function restart() {
  document.querySelector(".dialog").classList.remove("dialog--visible");
  startQuiz();
}

function close() {
  document.querySelector(".dialog").classList.remove("dialog--visible");
  main.classList.remove("main--visible");
  start.classList.add("main__button--visible");
}

function createQuestions() {
  let qNumber = 0;
  let qAnswers = [];
  for (let obj of data) {
    qNumber++;

    let question = document.createElement("div");
    question.setAttribute("class", "question question--sm");

    let qText = document.createElement("h3");
    qText.classList.add("question__text");
    qText.textContent = "Q" + qNumber + ". " + decode(obj.question);
    question.appendChild(qText);

    correctAnswers.push(decode(obj.correct_answer));
    qAnswers.push(decode(obj.correct_answer));
    for (let incorrect of obj.incorrect_answers) {
      qAnswers.push(decode(incorrect));
    }

    while (qAnswers.length > 0) {
      let i = Math.floor(Math.random() * qAnswers.length);

      let container = document.createElement("div");
      container.classList.add("question__answers");

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

      question.appendChild(container);
      main.querySelector(".main__questions-container").appendChild(question);
      qAnswers.splice(i, 1);
    }
  }
}

function getData() {
  new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open("GET", "https://opentdb.com/api.php?amount=10&type=multiple");
    req.onload = function() {
      resolve(req.responseText);
    };
    req.send();
  }).then(function(result) {
    data = JSON.parse(result).results;
  });
}

function decode(input) {
  let doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function trapFocus(element) {
  let focusableEls = element.querySelectorAll(".dialog__button");
  let firstFocusableEl = focusableEls[0]
  let lastFocusableEl = focusableEls[focusableEls.length - 1];
  let KEYCODE_TAB = 9;

  element.addEventListener('keydown', function(e) {
    let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) /* shift + tab */ {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }

  });
}