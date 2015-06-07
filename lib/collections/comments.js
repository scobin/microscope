Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });
    
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);
    
    if (!post) {
      throw new Meteor.Error('invalid-comment', 'You must comment on a post.');
    }
    
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.profile['first-name'] + ' ' + user.profile['last-name'],
      submitted: new Date()
    });
        
    // create the comment, save the id.
    comment._id = Comments.insert(comment);
    
    // update the post with the number of comments
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});
    
    // now create a notification, informing the user that there's been a comment.
    createCommentNotification(comment);
    
    return comment._id;
  }
});