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
        var options = {
          data: {
            utt: text,
            context: context,
            mode: mode
          }
        };
        // use async HTTP.post in Client.(for test)
        // HTTP.post('https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=7254667854504d6c6c3674766b4a497770536434434c752f666938565237724f433737304b4868726b7532',
        // options,
        // function(error, result) {
        //   if (!error && result.statusCode == 200) {
        //     var res_msgArray = Session.get('Messages');
        //     res_msgArray.push({
        //       'user': 'robot',
        //       'text': result.data.utt,
        //       'timestamp': Date.now()
        //     });
        //     Session.set('Messages', res_msgArray);
        //     Session.set('context', result.data.context);
        //     Session.set('mode', result.data.mode);
        //   } else {
        //     console.log('error: ' + result.statusCode);
        //   }
          
        // });
        
        // use server method to get result.
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