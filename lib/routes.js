//routes for the app
Router.configure({
    layoutTemplate: 'mainLayout'
});
Router.route('/', {
    template: 'pondyHome',
    name: 'home.static'
});

Router.route('/group/:groupId', {
    template: 'Group',
    name: 'group.show',
    data: function() {
        console.log(this.params, Session);
    }
});
Router.route('/about', {
    template: 'about',
    name: 'about.static'
});
Router.route('/instructions', {
    template: 'Instructions',
    name: 'instructions.static'
});
Router.route('/contact', {
    template: 'contact',
    name: 'contact.static'
});
Router.route('/download', {
    template: 'Download',
    name: 'download.static'
});
Router.route('/mapp', {
    template: 'Map',
    name: 'app.show',
  
    action: function(){
        var filters = this.params.query.categories.split(',');
        var groups = this.params.query.groups.split(',');
        console.log(groups);
        Session.set('categoryFilter', filters);
        Session.set('groupFilter', groups)
        this.render();
    }
});


  Router.route('/login', {
      template: 'Login',
      name: 'login.static'
});
Router.route('/register', {
    template: 'Register',
    name: 'register.static'
});
