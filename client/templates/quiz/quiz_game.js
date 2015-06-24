Template.quizGame.helpers({
  
});

checkAns = function(target) {
  if (Quizs.findOne().ans === target.id) {
    $(target).css('background', '#EE178C');
    $(target).html(function() {
      return "<b>○ </b> " + $(target).text(); 
    });
    console.log('correct!');
  } else {
    $(target).css('background', '#152A2D');
    $(target).html(function() {
      return "<b>× </b> " + $(target).text(); 
    });
    console.log('wrong!');
  }
}
Template.quizGame.events({
  'click #sel1, click #sel2, click #sel3, click #sel4': function(e) {
    e.preventDefault();
    checkAns(e.target);
  }
});
