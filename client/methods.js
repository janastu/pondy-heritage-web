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
            console.log(err);
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
            Session.set('userSession', result.data);

            //Router.go('/mapp');
                Router.go('app.show',{}, {'query': {'groups': _.map(Session.get('Groups'), function(item){return item.name}).toString(),
                'categories': Session.get('categoryList').toString()}});
                Session.set('showDialog', true);
                Session.set('loginSpinner', false);
                Bert.alert({
                    title: 'Login Succes',
                     message: 'Hi '+result.data.token.split(":")[0].toUpperCase()+'!',
                    type: 'success',
                    style: 'growl-top-right',
                    icon: 'fa-check'
                });      
              MAPP.API.getGroupsForUser({userName: result.data.token.split(":")[0]});
              
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
        function(err, response){
          
          if(err){
            Session.set('loginSpinner', false);
            Bert.alert({
                    title: 'Register Failed',
                     message: 'Something went wrong, try again!',
                    type: 'danger',
                    style: 'growl-top-right',
                    icon: 'fa-remove'
                });
           
            
          } 
          else if(response.data.code === 200){
           
            Session.set('registerSpinner', false);
             Bert.alert({
                    title: 'Register success',
                     message: response.data.message,
                    type: 'success',
                    style: 'growl-top-right',
                    icon: 'fa-check'
                });
             Router.go('/login');
          }
          else if(response.data.code === 402 || response.data.code === 403){
             Session.set('loginSpinner', false);
             Bert.alert({
                    title: 'Register Failed',
                     message: response.data.message,
                    type: 'danger',
                    style: 'growl-top-right',
                    icon: 'fa-remove'
                });
           
           
          }

        });

    },

    joinGroup: function(request){
      var apiUrl = Meteor.settings.public.apis.joinGroup+"user/"+request.userName+
                    "/group/"+request.groupId+"?reason=Request to Join Group";
      Meteor.http.call("POST", apiUrl, 
                        {headers:{
                                  "Content-Type":"application/json", 
                                  "Accept":"application/json",
                                  "X-Auth-Token": request.token
                                }},
                        function(err, response){
                          if(!err){
                            //alert success
                            Bert.alert({
                                    title: 'Request Sent!',
                                    message: 'The Group admin is notified about your Join request',
                                    type: 'success',
                                    style: 'growl-top-right',
                                    icon: 'fa-check'
                                });
                          } 
                          else {
                            Bert.alert({
                                    title: 'Unable to send Request',
                                     message: 'Something went wrong, try again!',
                                    type: 'danger',
                                    style: 'growl-top-right',
                                    icon: 'fa-remove'
                                });
                          }

      });
    }
});