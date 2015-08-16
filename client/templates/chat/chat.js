Template.chat.onCreated(function() {
  Session.set('chatErrors', {});
});

Template.chat.helpers({
  errorMessage: function(field) {
    return Session.get('chatErrors')[field];
  },
  errorClass: function(field){
    return !!Session.get('chatErrors')[field] ? 'has-error' : '';
  }
});

Template.chat.events({
  'keypress input': function(e) {
    var inputVal = $('#input_msg').val();
    if (!!inputVal) {
      var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
      if (charCode == 13) {
        e.stopPropagation();
        var msgArray = Session.get('Messages');
        var text = $('#input_msg').val();
        msgArray.push({
          'user': $('#input_name').val(),
          'text': text,
          'timestamp': Date.now()
        });
        Session.set('Messages', msgArray);
        $('#input_msg').val("");

        //call method
        var context = !!Session.get('context') ? Session.get('context') : null;
        var mode = !!Session.get('mode') ? Session.get('mode') : null;
        Meteor.call('talk', text, context, mode, function(error, result) {
          if (error) {
            throwError(error.reason);
          }
          console.log('result:');
          console.log(result);
          var res_msgArray = Session.get('Messages');
          res_msgArray.push({
            'user': 'robot',
            'text': result.utt,
            'timestamp': Date.now()
          });
          Session.set('Messages', res_msgArray);
          Session.set('context', result.context);
          Session.set('mode', result.mode);

        });

        return false;
      }
    }
  }
});