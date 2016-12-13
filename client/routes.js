//routes for the app
Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: "NotFound"
});
Router.route('/', {
    template: 'pondyHome',
    name: 'home.static'
});


Router.route('/dashboard', {
    template: 'Profile',
    name: 'profile.show',
    action: function() {
        console.log(this.params.hash, Session.get('userSession'));
        if(Session.get('userSession')){
            this.render();
        }
        else {
            this.next();

        }
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
Router.route('/groups', {
    template: 'Groups',
    name: 'groups.show'
});
Router.route('/mapp', {
    template: 'Map',
    name: 'app.show',
    action: function(){
        //var categories, groups;
 
            var categories = this.params.query.categories.split(',');
            var groups = this.params.query.groups.split(',');
            Session.set('categoryFilter', categories);
            Session.set('groupFilter', groups);
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
