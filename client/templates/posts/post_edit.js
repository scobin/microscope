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
      Router.go('postsList');
    }
  }
});