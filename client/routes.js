//routes for the app

FlowRouter.route('/', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content: 'pondyHome'});
    },
    name: 'home.show'
});
FlowRouter.route('/apps/:appId', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content: 'group'});
    },
    name: 'rest'
});
FlowRouter.route('/about', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content:'about'});
    },
    name: 'about'
});
FlowRouter.route('/instructions', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content:'Instructions'});
    },
    name: 'instructions'
});
FlowRouter.route('/contact', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content:'contact'});
    },
    name: 'contact'
});
FlowRouter.route('/download', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content:'Download'});
    },
    name: 'download'
});
FlowRouter.route('/map', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content: 'Map'});
    },
    name: 'map'
});
  FlowRouter.route('/login', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content:'Login'});
        Session.set('showDialog', false);
    },
      name: 'login'
});
FlowRouter.route('/register', {
    action: function(params) {
        FlowLayout.render('mainLayout', {content:'Register'});
    },
    name: 'register'
});
/*FlowRouter.route('/add-to-map', {
    action: function(params) {
       if(Session.get('userSession')){
        FlowLayout.render('Layout', {content:'MapEditor'});
      } else {
        FlowRouter.go('/login');
      }
    }
});
/*FlowRouter.route('/map/:region', {
    action: function(params) {
      FlowLayout.render('Layout', {content: 'Map'});
  }
  });*/
