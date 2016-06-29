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
            Bert.alert({
                    title: 'Login Failed',
                     message: 'Something went wrong, try again!',
                    type: 'danger',
                    style: 'growl-top-right',
                    icon: 'fa-remove'
                });
            Session.set('loginSpinner', false);
            /*Session.set("errorAlert", true);
            
            Meteor.setTimeout(function(){
              Session.set("errorAlert", false);
              
            }, 5000);*/
          } else {
           
            //storing in browser
            sessionStorage.setItem('userSession', JSON.stringify(result.data));

            
            Meteor.http.call("GET", Meteor.settings.public.apis.getGroupForUser+result.data.token.split(":")[0], function(err, response){
              if(!err){
                console.log(response.data);
                Session.set("Groupinfo", response.data);  
                sessionStorage.setItem('userGroups', JSON.stringify(response.data));
                //Router.go('/mapp');
                Router.go('app.show',{}, {'query': {'groups': _.map(Session.get('Groups'), function(item){return item.name}).toString(),
                'categories': Session.get('categoryList').toString()}});
                Session.set('showDialog', true);
                Session.set('loginSpinner', false);
                Bert.alert({
                    title: 'Login Succes',
                     message: 'Hi '+result.data.token.split(":")[0]+'!',
                    type: 'success',
                    style: 'growl-top-right',
                    icon: 'fa-check'
                });
                }
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
            Bert.alert({
                    title: 'Register Failed',
                     message: 'Something went wrong, try again!',
                    type: 'danger',
                    style: 'growl-top-right',
                    icon: 'fa-remove'
                });
            //Session.set("errorAlert", true);
            Session.set('loginSpinner', false);
           /* Meteor.setTimeout(function(){
              Session.set("errorAlert", false);

            }, 5000);*/
            
            
          } else {
            //Session.set('registerSuccess', true);
            Router.go('/login');
            Session.set('registerSpinner', false);
             Bert.alert({
                    title: 'Register Succes',
                     message: 'You can now Login and add to mapp!',
                    type: 'success',
                    style: 'growl-top-right',
                    icon: 'fa-check'
                });
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