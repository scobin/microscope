Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')];
  }
});

//==== posts ====
// for pagination.
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
//   waitOn: function() {
//     return Meteor.subscribe('posts', this.findOptions());
//   },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment});
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment});
  }    
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {
  name: 'newPosts'
});

Router.route('/best/:postsLimit?', {
  name: 'bestPosts',
});

Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [Meteor.subscribe('comments', this.params._id),
           Meteor.subscribe('singlePost', this.params._id)
           ];
  },
  data: function() {
    return Posts.findOne(this.params._id);
  }
});
Router.route('/submit', {name: 'postSubmit'});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() {
    return Posts.findOne(this.params._id);
  }
});

//==== quizs ====
Router.route('/quizGame/', {
  name: 'quizGame',
  waitOn: function() {
    return [Meteor.subscribe('randQuizs'), 
    Meteor.subscribe('refPosts')];
  },
  data: function() {
    return Quizs.findOne();
  }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

//==== docomo API ====
Router.route('/chat/', {
  name: 'chat',
  // waitOn: function() {
  //   return;
  // },
  data: function() {
    return;
  }
});

//==== rest test ====
Router.route('/restTest/:ip', function() {
  var req = this.request;
  var res = this.response;
  // res.end('hello from the server\n');
  console.log('Method.geoJsonForIp for', this.params.ip);
  // Construct the API URL
  var apiUrl = 'http://www.telize.com/geoip/' + this.params.ip;
  // query the API
  var response = HTTP.get(apiUrl);
  res.end('res_data: ' + response.data + '\nres_content: ' + response.content );
}, {where: 'server'});

//==== talk test
Router.route('/talkTest/:msg', function() {
  var req = this.request;
  var res = this.response;
  console.log('send: ', this.params.msg);
  // Construct the API URL
  var options = {
      data: {
        utt: this.params.msg
        // context: ctx,
        // mode: mode
      }
    };
  var url = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=7254667854504d6c6c3674766b4a497770536434434c752f666938565237724f433737304b4868726b7532';
  HTTP.post(url, options, function(error, result) {
    if (!error && result.statusCode == 200) {
      console.log(result.content);
      res.end("receive: " + result.data.utt);
    }
    else {
      console.log('error: ' + result.statusCode + ': ' + result.content);
      res.end();
    }
  });
}, {where: 'server'});