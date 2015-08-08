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

Meteor.methods({
	quizInsert: function(quizAttributes) {
		check(Meteor.userId, String);
		check(quizAttributes, {
			title: String,
			sel1: String,
			sel2: String,
			sel3: String,
			sel4: String,
			ans: String
		});

	var errors = validateQuiz(quizAttributes);
	if (errors.title || errors.selection1 ||
		errors.selection2 || errors.selection3 ||
		errors.selection4 || errors.ans) {
		throw new Meteor.Error('invalid-quiz', 'attributes of quiz are not enough.');
	}


	var user = Meteor.user();
	var quiz = _.extend(quizAttributes, {
		author: user.profile['first-name'],
		submitted: new Date(),
		isValid: 1,
	});
	var quizId = Quizs.insert(quiz);

	return {_id: quizId};
}

});