if (Posts.find().count() === 0) {
  var now = new Date().getTime();
  
  //create two users
  var tomId = Meteor.users.insert({
    profile:{'first-name': 'Tom', 'last-name':'Coleman'}
  });
  var tom = Meteor.users.findOne(tomId);
  var sachaId = Meteor.users.insert({
    profile:{'first-name': 'sacha', 'last-name': 'Greif'}
  });
  var sacha = Meteor.users.findOne(sachaId);
  
  var telescopeId = Posts.insert({
    title:'Introduction Telescope',
    userId: sacha._id,
    author: sacha.profile['first-name'],
    url:'http://sachagreif.com/introduction-telescope/',
    submitted: new Date(now - 7 * 3600 * 1000),
    commentsCount: 2,
    upvoters: [],
    votes: 0
  });
  
  Comments.insert({
    postId: telescopeId,
    userId: tom._id,
    author: tom.profile['first-name'],
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Interesting project Sacha, can I get involved?'
  });
  
  Comments.insert({
    postId: telescopeId,
    userId: sacha._id,
    author: sacha.profile['first-name'],
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'You sure can Tom!'
  });
  
  Posts.insert({
    title:'Meteor',
    userId: tom._id,
    author: tom.profile['first-name'],
    url:'http://meteor.com',
    submitted: new Date(now - 10 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [],
    votes: 0
  });
  Posts.insert({
    title:'The Meteor Book',
    userId: tom._id,
    author: tom.profile['first-name'],
    url:'http://themeteorbook.com',
    submitted: new Date(now - 12 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [],
    votes: 0
  });
  
  for (var i = 0; i < 10 ;i++) {
    Posts.insert({
      title:'Test post #' + i,
      userId: tom._id,
      author: tom.profile['first-name'],
      url:'http://google.com/?q=test-' + i,
      submitted: new Date(now - i * 3600 * 1000 + 1),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });
  }
}