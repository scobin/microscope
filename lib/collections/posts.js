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

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

/**
* validation for post input 
*/
validatePost = function (post) {
  var errors = {};
  
  if (!post.title || post.title.trim() === '') {
    errors.title = "Please fill in a headline";
  }
  
  if (!post.url || post.url.trim() === '') {
    errors.url = "Please fill in a URL";
  }
  
  return errors;
};

Meteor.methods({
  postInsert: function(postAttributes) {
    // check all of the postAttributes
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String,
      message: String
    });
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");
    }
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
      submitted: new Date(),
      commentsCount: 0,
      upvotes: [],
      votes: 0
    });
    
    var postId = Posts.insert(post);
    
    return {
      _id: postId
    };
  },
  
  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);
    
    var post = Posts.find(postId);
    if (!post) {
      throw new Meteor.Error('invalid', 'Post not found');
    }
    
    if (_.include(post.upvoters, this.userId))
      throw new Meteor.Error('invalid', 'Already upvoted this post');
    
    Posts.update(post._id, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
  }
});