Posts = new Meteor.Collection('posts');

Posts.allow({
//   insert: function(userId, doc) {
//     // only allow posting if you are logged in
//     return !! userId;
//   }
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    // check all of the postAttributes
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String,
      message: String
    });
    
    //check if the url has been exist or not
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    console.log(postWithSameLink);
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    // add userId, userName, current date to data
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.profile['first-name'],
      submitted: new Date()
    });
    
    var postId = Posts.insert(post);
    
    return {
      _id: postId
    };
  }
});