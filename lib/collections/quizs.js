Quizs = new Meteor.Collection('quizs');

/**
* validation for quiz input 
*/
validateQuiz = function (quiz) {
  var errors = {};
  
  if (!quiz.title || quiz.title.trim() === '') {
    errors.quizTitle = "Please fill in a headline.";
  }
  
  if (!quiz.selection1 || quiz.selection1.trim() === '') {
    errors.quizSel1 = "Please fill in a selection.";
  }

  if (!quiz.selection2 || quiz.selection2.trim() === '') {
    errors.quizSel2 = "Please fill in a selection.";
  }

  if (!quiz.selection3 || quiz.selection3.trim() === '') {
    errors.quizSel3 = "Please fill in a selection.";
  }

  if (!quiz.selection4 || quiz.selection4.trim() === '') {
    errors.quizSel4 = "Please fill in a selection.";
  }
  
  if (!quiz.ans || quiz.ans.trim() === '') {
    errors.quizAns = "Please set the answer.";
  }
  return errors;
};