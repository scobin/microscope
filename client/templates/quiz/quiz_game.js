Template.quizGame.helpers({
  
});

checkAns = function(sel) {
  if (Quizs.findOne().ans === sel) {
    console.log('correct!');
  } else {
    console.log('wrong!');
  }
}
Template.quizGame.events({
  'click #sel1, click #sel2, click #sel3, click #sel4': function(e) {
    e.preventDefault();
    console.log(e.target.id);
    checkAns(e.target.id);
  }
});
