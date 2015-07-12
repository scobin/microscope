var alreadyAnswer = false;

Template.quizGame.helpers({
  quizExist: function() {
    return Quizs.find().count() > 0 ;
  },
  refPosts: function() {
    return Posts.find({id: {$in: Quizs.findOne().refPostIds}});
    // return Posts.find();
  },
  recPosts: function() {
    return Posts.find({category: Quizs.findOne().category});
  }
});

checkAns = function(target) {
  if (Quizs.findOne().ans === target.id) {
    $(target).css('background', '#17CDEE');
    $(target).html(function() {
      return "<b>○ </b> " + $(target).text(); 
    });
    console.log('correct!');
    return 1;
  } else {
    $(target).css('background', '#152A2D');
    $(target).html(function() {
      return "<b>× </b> " + $(target).text(); 
    });
    console.log('wrong!');
    return 0;
  }
};

Template.quizGame.events({
  'click #sel1, click #sel2, click #sel3, click #sel4': function(e) {
    e.preventDefault();
    if (!alreadyAnswer) {
      var res = checkAns(e.target);
      alreadyAnswer = true;
    }
    $(".next").show();
    $(".refPosts").show();
  },
  'click .next': function(e) {
    e.preventDefault();
    //reload page
    location.reload();
  }
});
