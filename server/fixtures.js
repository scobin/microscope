if (Posts.find().count() === 0) {
  Posts.insert({
    title:'Introduction Telescope',
    author:'Sacha Greif',
    url:'http://sachagreif.com/introduction-telescope/'
  });
  Posts.insert({
    title:'Meteor',
    author:'Tom Coleman',
    url:'http://meteor.com'
  });
  Posts.insert({
    title:'The Meteor Book',
    author:'Tom Coleman',
    url:'http://themeteorbook.com'
  });
}