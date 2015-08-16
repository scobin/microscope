// Meteor.methods({
//   newMessage: function (message) {
//   	message.timestamp = Date.now();
//     message.user = Meteor.userId();
//     Messages.insert(message);
//   }
// });

Meteor.methods({
  talk: function(msg, ctx, mode) {
    check(msg, String);
    check(ctx, Match.Any);
    check(mode, Match.Any);
    this.unblock();
    var options = {
      data: {
        utt: msg,
        context: ctx,
        mode: mode
      }
    };
    var url = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=7254667854504d6c6c3674766b4a497770536434434c752f666938565237724f433737304b4868726b7532';
    // var result = HTTP.post(url, options, function(error, response) {
    //   if (!error && response.statusCode == 200) {
    //     console.log('response: ' + response.data);
    //     return response.data;
    //   }
    //   else {
    //     console.log('error: ' + response.statusCode);
    //   }
    // });
    try {
      var result = HTTP.post(url, options);
      return result.data;
    } catch(e) {
      console.log("cannot get result..." + e);
    }
  },
  // The method expects a valid IPv4 address
  'geoJsonForIp': function (ip) {
    console.log('Method.geoJsonForIp for', ip);
    // Construct the API URL
    var apiUrl = 'http://www.telize.com/geoip/' + ip;
    // query the API
    var response = HTTP.get(apiUrl).data;
    return response;
  }
});
