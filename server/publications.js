Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});

Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find();
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});

Meteor.publish('randQuizs', function(){
  var randNum = Math.floor( Math.random() * Quizs.find().count() ) + 1;
  return Quizs.find({num: randNum, isValid: true});
});

Meteor.publish('refPosts', function() {
  // cehck(id, String);
  return Posts.find();
});