//V0.0.1 

//API calls to heritage web server
//fix needed heritageGeoJson is not working
Meteor.methods({
    //this is not working, hence using mapbox load
    heritagGeoJson: function(){
      this.unblock();
      var response = Meteor.http.call("GET","http://pondy.openrun.com:8080/heritageweb/api/allGeoTagHeritageEntitysGeoJson", 
        function(err, data){
          if(!err){
            return data;
          }
        });
      return response;
    },
    Login: function(request){

     /* var response = */Meteor.http.call("POST", Meteor.settings.public.apis.login, 
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
            //storing in browser
            sessionStorage.setItem('userSession', JSON.stringify(result.data));

            
            Meteor.http.call("GET", Meteor.settings.public.apis.getGroupForUser+result.data.token.split(":")[0], function(err, response){
              if(!err){
                console.log(response.data);
                Session.set("Groupinfo", response.data);  
                sessionStorage.setItem('userGroups', JSON.stringify(response.data));
                //Router.go('/mapp');
                Router.go('app.show',{}, {'query': {'groups': Session.get('groupFilter').toString(),
                'categories': Session.get('categoryFilter').toString()}})
                Session.set('showDialog', true);
                Session.set('loginSpinner', false);         }
              });
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
            console.log(result);
            //Router.go('/login/');
            Session.set('registerSpinner', false);

          }

        });

    },

    getGroupForUser: function(request){
     var response = Meteor.http.call("GET", Meteor.settings.public.apis.getGroupForUser, function(err, data){
              if(!err){
                
                Session.set("Groupinfo", data);           }
              });
     
   }
});