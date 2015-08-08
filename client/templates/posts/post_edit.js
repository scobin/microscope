Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function(field){
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id;
    var postProperties = {
      title: $(e.target).find('[name=title]').val(),
      url: $(e.target).find('[name=url]').val()
    };
    
    var errors = validatePost(postProperties);
    console.log(errors);
    if (errors.title || errors.url) {
      return Session.set('postEditErrors', errors);
    }
    
    Posts.update(currentPostId, // id
                 {$set: postProperties}, //data
                 function(error) { // call back func.
      if (error) {
        throwError(error.reason);
      } else {
        // go to the postPage
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },
  'click .delete': function(e){
    e.preventDefault();
    
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      // go to postsList
      Router.go('home');
    }
  },
  'submit .quizForm': function(e) {
    e.preventDefault();
    var quiz = {
      category: this.category,
      refPostIds: [this.id],
      title: $(e.target).find('[name=quizTitle]').val(),
      selection1: $(e.target).find('[name=quizSel1]').val(),
      selection2: $(e.target).find('[name=quizSel2]').val(),
      selection3: $(e.target).find('[name=quizSel3]').val(),
      selection4: $(e.target).find('[name=quizSel4]').val(),
      ans: $(e.target).find('.ansStatus.active [name=ansOpt]').val()
    };
    var errors = validateQuiz(quiz);
    if (errors.quizTitle || errors.quizSel1 || errors.quizSel2
      || errors.quizSel3 || errors.quizSel4 || errors.quizAns) {
      return Session.set('postSubmitErrors', errors);
    }
    // quiz =
  }
});