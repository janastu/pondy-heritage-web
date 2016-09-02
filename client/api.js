  /* App global configuration  and local apis for client*/
  
(function() {
MAPP ={};
MAPP.API ={};
MAPP.appName = Meteor.settings.public.appConfig.appId;
// To store the app config like, regions, categories and groups
MAPP.AppConfig = new ReactiveDict();
var browserSessionconfig = sessionStorage.getItem('appConfig');

//Map features to store a filter set of features by appName
MAPP.GeoJson = new ReactiveDict();

updateAppConfig = function(arg){
    var sessionObj = JSON.parse(arg);
    
    Session.set('Regions', sessionObj.regions);
    Session.set('Groups', sessionObj.groups);
    Session.set('Categories', sessionObj.categorys);
    Session.set('Languages', sessionObj.languages);
                
    Session.set("categoryList",
            _.map(Session.get('Categories'), 
                function(cat){
                    return cat.categoryName;
                }));

}

if(browserSessionconfig){
    MAPP.AppConfig.set('appConfig', JSON.parse(sessionStorage.getItem('appConfig')));
    updateAppConfig(browserSessionconfig);
}

// user session if saved in browser session storage
if(sessionStorage.userSession){
            var userSession = JSON.parse(sessionStorage.userSession);
            Session.set('userSession', userSession);
            Session.set('showDialog', true);

}

//Get app config from server api and set globals  
MAPP.API.getApps = function(){ 
  Meteor.http.call("GET", Meteor.settings.public.apis.getApps,  function(err, success) {
            
            if(!err) {
               
                allApps = success.data;
                setAppConfig(allApps);
                 
            } else {
                console.log("error getting apps", err);
            }
        });
  function setAppConfig(arg){
    //the argument is response data from the call
    //find the app config for the appName from settings
    //and set globals 

    _.each(arg, function(app){
        
        if(app.name == MAPP.appName){
            
            sessionStorage.setItem('appConfig', JSON.stringify(app));
            updateAppConfig(sessionStorage.getItem('appConfig'));
        }
    });
    
 
  }
}
MAPP.API.getApps();
  // Get features for Map from api server
//for testing geojson
MAPP.API.getFeatures = function(){
 Meteor.http.call("GET", Meteor.settings.public.apis.getFeatures, function(err, res){
    //Filter response data by appName - such that only context
    // specific features are displayed
    if(!err){
        MAPP.GeoJson.set('Features', 
            {'type': 'FeatureCollection', 
        'features':_.compact(_.map(res.data.features, function(feature){ 
         if(feature.properties.appname === MAPP.appName){
            return feature;
        }   
                }))
            });
    }
});
}


//function call to get data from server and set geojson
MAPP.API.getFeatures();

MAPP.API.postToServer = function(fd){
        //new xmlhttp request
        var xhr = new XMLHttpRequest();
        
        //loader
        xhr.addEventListener("load", function(e){
                        
            //alert success
            Bert.alert({
                    title: 'Upload Succes!',
                     message: 'Your pin is added to map!',
                    type: 'success',
                    style: 'growl-top-right',
                    icon: 'fa-check'
                });
            //Refresh all views
            //remove spinner
            Session.set('uploadSpin', false);
            
            //remove modal from view
            $('#add-heritage').modal('toggle');
            //refresh map data layer 
            overlays.clearLayers();
            myLayer.loadURL(Meteor.settings.public.apis.getFeatures);
            //refresh sidebar
            MAPP.API.getFeatures();
            //clear mapclick session value
            Session.set('mapClick', "");
        });
        
        //posting to server endpoint
        xhr.open('POST', Meteor.settings.public.apis.postFeature);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send(fd);
   
        
        xhr.addEventListener("error", function(e){
            Bert.alert({
                    title: 'Post Failed',
                     message: 'Something went wrong, try again!',
                    type: 'danger',
                    style: 'growl-top-right',
                    icon: 'fa-remove'
                });
            Session.set('uploadSpin', false);
    
        });
}


MAPP.API.editFeature = function(featureId){
    console.log("called edit feature api", featureId);
}

MAPP.API.deleteFeature = function(featureId){
var sessionToken = Session.get('userSession').token;
    var url = Meteor.settings.public.apis.deleteFeature+featureId;
    
    new Confirmation({
    message: "Are you sure you want to Delete?",
    title: "Confirmation"
}, function (ok) {
  // ok is true if the user clicked on "ok", false otherwise

  if(ok){
    Session.set('uploadSpin', true);
    console.log(featureId, url, sessionToken);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(e){
      Session.set('uploadSpin', false);
      
      overlays.clearLayers();
      myLayer.loadURL(Meteor.settings.public.apis.getFeatures);
      MAPP.API.getFeatures();
     
    });
    xhr.open('DELETE', url);
        xhr.withCredentials=true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("X-Auth-Token", sessionToken);
         
        xhr.send();
    
  } else {
    Bert.alert({
                    title: 'Delete cancelled',
                     message: '',
                    type: 'info',
                    style: 'growl-top-right',
                    icon: 'fa-info'
                });
  }
});
}
MAPP.API.getGroupsForUser = function(arg){
      Meteor.http.call("GET", Meteor.settings.public.apis.getGroupForUser+arg.userName, function(err, response){
              if(!err){
               
                Session.set("Groupinfo", response.data);  
                sessionStorage.setItem('userGroups', JSON.stringify(response.data));
                
                }
              });
    this.getStorageLimit(arg);
      
    }

MAPP.API.getStorageLimit = function(arg){
      var apiUrl = "http://196.12.53.138:8080/heritageweb/api/getCurrentStorageSize/user/"+arg.userName;
      Meteor.http.call("POST", apiUrl, 
                        {headers:{
                                  "Content-Type":"application/json", 
                                  "Accept":"application/json",
                                  "X-Auth-Token": Session.get('userSession').token
                                }},
                        function(err, response){
                          if(!err){
                            Session.set('storageLimit', response.data);
                            console.log(response);
                          }
                        });
    }
    

})();

//Contact form events
Template.contactForm.events({
    "submit form": function(event){
        Meteor.setTimeout(function(){
            Bert.alert({
                    title: 'Email sent',
                     message: 'Thanks for your feedback',
                    type: 'success',
                    style: 'growl-top-right',
                    icon: 'fa-check'
                });
    }, 5000);
    }
});