//controller for alerts


Template.mainLayout.helpers({
  showDialog: function() {
    return Session.get('showDialog');

  }

});


Template.LoggedUser.helpers({


  userSession: function(){
    // user session if saved in browser session storage
if(sessionStorage.userSession){
            var userSession = JSON.parse(sessionStorage.userSession);
            Session.set('userSession', userSession);
            Session.set('showDialog', true);

}

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
    sessionStorage.userSession = "";
    Session.set('userSession', "");
    Session.set('showDialog', false);
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


