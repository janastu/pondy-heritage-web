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
    name: 'map'
});
//This route should be /app/:appId
//however client side css and JS breaks
//help need to debug
//methods also fail - returning error
//fixed css with meteor stylesheets directory
Router.route('/map/:appId', {
    template: 'Map',
    name: 'app.show',
    data: function() {
        var params = this.params;
        if(params == "pondymap") {
        console.log("params", this.params);
        }
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
