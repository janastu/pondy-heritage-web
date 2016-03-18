//routes for the app

FlowRouter.route('/', {
    action: function(params) {
        FlowLayout.render('pondyHome');
    }
});
FlowRouter.route('/about', {
    action: function(params) {
        FlowLayout.render('about');
    }
});
FlowRouter.route('/instructions', {
    action: function(params) {
        FlowLayout.render('Instructions');
    }
});
FlowRouter.route('/contact', {
    action: function(params) {
        FlowLayout.render('contact');
    }
});
FlowRouter.route('/download', {
    action: function(params) {
        FlowLayout.render('Download');
    }
});
FlowRouter.route('/map', {
    action: function(params) {
        FlowLayout.render('Layout', {content: 'Map'});
    }
});
  FlowRouter.route('/login', {
    action: function(params) {
        FlowLayout.render('Login');
        Session.set('showDialog', false);
    }
});
FlowRouter.route('/register', {
    action: function(params) {
        FlowLayout.render('Register');
    }
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