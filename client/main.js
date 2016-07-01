  /* App global configuration*/
  //network report high TTFB - need to check server response timing

appName = Meteor.settings.public.appConfig.appId;
// To store the app config like, regions, categories and groups
appConfig = new ReactiveDict();
var browserSessionconfig = sessionStorage.getItem('appConfig');
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
    appConfig.set('appConfig', JSON.parse(sessionStorage.getItem('appConfig')));
    updateAppConfig(browserSessionconfig);
}

//Map features to store a filter set of features by appName
GeoJson = new ReactiveDict();
// user session if saved in browser session storage
if(sessionStorage.userSession){
            var userSession = JSON.parse(sessionStorage.userSession);
            Session.set('userSession', userSession);
            Session.set('showDialog', true);

}

//Get app config from server api and set globals   
  Meteor.http.call("GET", Meteor.settings.public.apis.getApps,  function(err, success) {
            
            if(!err) {
               
                allApps = success.data;
                setGlobals(allApps);
                 
            } else {
                console.log("error getting apps", err);
            }
        });
  function setGlobals(arg){
    //the argument is response data from the call
    //find the app config for the appName from settings
    //and set globals 

    _.each(arg, function(app){
        
        if(app.name == appName){
            
            sessionStorage.setItem('appConfig', JSON.stringify(app));
            updateAppConfig(sessionStorage.getItem('appConfig'));
        }
    });
    
 
  }

  // Get features for Map from api server
//for testing geojson

 Meteor.http.call("GET", Meteor.settings.public.apis.getFeatures, function(err, res){
    //Filter response data by appName - such that only context
    // specific features are displayed
    if(!err){
        GeoJson.set('Features', {'type': 'FeatureCollection', 
        'features':_.compact(_.map(res.data.features, function(feature){ 
         if(feature.properties.appname === appName){
            return feature;
        }
    }))
    });
        
    }
});

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
    }, 1000);
    }
})