//controller for alerts



Template.dismissibleAlert.onCreated(function(){
  //Session variable for error alert when signin fails
  Session.set("errorAlert", false);
  Session.set("registerSuccess", false);
});

Template.dismissibleAlert.onRendered(function(){
  var instance = Template.instance();
  Meteor.setTimeout(function(){
    Session.set("registerSuccess", false);
}, 5000);
});

Template.dismissibleAlert.helpers({

  errorAlert: function() {
    return Session.get('errorAlert');

  },
  uploadMedia: function(){
    return  Session.get('uploadMedia');
  },
  markerAlert: function(){
    return Session.get('markerAlert');
  },
  registerSuccess: function(){
    return Session.get('registerSuccess');
  }
});


