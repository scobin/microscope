Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      message: $(e.target).find('[name=message]').val()
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
  }
});