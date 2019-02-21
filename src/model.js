export default {
  correctAnswers: [],
  setCorrectAnswers: function(answer) {
    this.correctAnswers.push(answer);
  },
  getCorrectAnswers: function() {
    return this.correctAnswers;
  },
  game: {
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
  },
  score: {
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
  }
};