//V0.0.1 

//API calls to heritage web server
//fix needed heritageGeoJson is not working
Meteor.methods({
    getApps: function() {
        var response = Meteor.http.call("GET", Meteor.settings.public.apis.getApps, function(err, result){
            if(err) {
                console.log("send error alert");
            } else {
                console.log("getApps", result.data);
                return result.data;
            }
        });
    },
    Login: function(request){

      var response = Meteor.http.call("POST", Meteor.settings.public.apis.login, 
        {content: 'username='+request.username+'&'+'password='+request.password, 
        headers:{"Content-Type":"application/x-www-form-urlencoded", "Accept":"application/json"}}, 
        function(err, result){
          if(err){
            Session.set("errorAlert", true);
            
            Meteor.setTimeout(function(){
              Session.set("errorAlert", false);
              Session.set('loginSpinner', false);
            }, 5000);
          } else {
            console.log("result", result.data);
            Session.set('userSession', result.data);
            Router.go('app.show', {appId: 'pondymap'});
            Session.set('loginSpinner', false);
            Session.set('showDialog', true);
          }
        });
    },
    Register: function(request){
      var response = Meteor.http.call("POST", Meteor.settings.public.apis.register,
        {content: 'username='+request.username+'&'+'password='+request.password+'&'+
        'emailId='+request.emailId+'&'+
        'residentstatus='+request.residentstatus+'&'+
        'agestatus='+request.agestatus+'&'+
        'specialmessage='+request.specialmessage,
        headers:{'Content-Type':'application/x-www-form-urlencoded', 'Accept':"application/json"}},
        function(err, result){
          if(err){
            Session.set("errorAlert", true);
            Session.set('loginSpinner', false);
            Meteor.setTimeout(function(){
              Session.set("errorAlert", false);

            }, 5000);
            
            
          } else {
            
            Router.go('login.static');
            Session.set('registerSpinner', false);
          }

        });

    }
});




