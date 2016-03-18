//V0.0.1 

//API calls to heritage web server
//fix needed heritageGeoJson is not working
Meteor.methods({
    //this is not working, hence using mapbox load
    heritagGeoJson: function(){
      this.unblock();
      var response = Meteor.http.call("GET","http://pondy.openrun.com:8080/heritageweb/api/allGeoTagHeritageEntitysGeoJson", 
        function(result){
          if(result){
            return result;
          }
        });
      return response;
    },
    Login: function(request){

      var response = Meteor.http.call("POST", "http://pondy.openrun.com:8080/heritageweb/api/authenticate", 
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
            FlowRouter.go('/map');
            Session.set('loginSpinner', false);
            Session.set('showDialog', true);
          }
        });
    },
    Register: function(request){
      var response = Meteor.http.call("POST", "http://pondy.openrun.com:8080/heritageweb/api/registerForMobile", 
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
            
            FlowRouter.go('/login/');
            Session.set('registerSpinner', false);
          }

        });

    }
});




