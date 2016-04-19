//controller for alerts


Template.mainLayout.helpers({
  showDialog: function() {
    return Session.get('showDialog');

  }

});


Template.LoggedUser.helpers({

  userSession: function(){
    if(Session.get('userSession')){
      var userStr = Session.get('userSession').token;
      var usrArray = userStr.split(":");
      var loggedUser = usrArray[0].toUpperCase();
      return {"loggedUser": loggedUser};

    } else {
      console.log("log in");
    }
  }
});
Template.LoggedUser.events({
  "click li": function() {
    Session.set('userSession', "");
    MAP.removeControl(DRAWCNTRL);

  }

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
  }
});


