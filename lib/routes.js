//routes for the app
Router.configure({
    layoutTemplate: 'mainLayout'
});
Router.route('/', {
    template: 'pondyHome',
    name: 'home.static'
});

//This route should be /app/:appId
//however client side css and JS breaks
//help need to debug
//methods also fail - returning error
Router.route('/map', {
    template: 'Map',
    name: 'app.show',
    data: function() {
        console.log("params", this.params);
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
/*Router.route('/map', {
    template: 'Map',
    name: 'map'
});*/
  Router.route('/login', {
      template: 'Login',
      name: 'login.static'
});
Router.route('/register', {
    template: 'Register',
    name: 'register.static'
});
