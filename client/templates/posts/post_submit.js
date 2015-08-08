Template.postSubmit.events({
  'submit .postForm': function(e) {
    e.preventDefault();
    
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      message: $(e.target).find('[name=message]').val()
    };
    
    var errors = validatePost(post);
    if (errors.title || errors.url) {
      return Session.set('postSubmitErrors', errors);
    }
    Meteor.call('postInsert', // server method
                post, // data
                function(error, result) { // callback func.
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      // show this result but route anyway
      if (result.postExists)
        throwError('This link has already been posted');

      Router.go('postPage', {_id: result._id});
    });
  },
  'click .checkUrl': function(e) {
    e.preventDefault();
    Meteor.call('checkUrl',
      $(e.target).prev().val(),
      function(error, result) {
        if (error) {
          throwError(error.reason);
        } else {
          Session.set('urlTitle', result);
        }

      });
  }
});

//run this function when template be created.
Template.postSubmit.onCreated = function() {
  //reset postSubmitErrors
  Session.set('postSubmitErrors', {});
  Session.set('urlTitle', {});
}

Template.postSubmit.helpers({
  errorMessage: function(field) {
    if (Session.get('postSubmitErrors')) 
      return !!Session.get('postSubmitErrors')[field] ? Session.get('postSubmitErrors')[field] : '';
    // return !!Session.get('postSubmitErrors')[field] ? Session.get('postSubmitErrors')[field] : '';
  },
  errorClass: function(field) {
    if (Session.get('postSubmitErrors')) 
      return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  },
  urlTitle: function() {
    return !!Session.get('urlTitle') ? Session.get('urlTitle') : '';
  }
});