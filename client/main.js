  /* App global configuration*/
  //network report high TTFB - need to check server response timing

appName = Meteor.settings.public.appConfig.appId;
// To store the app config like, regions, categories and groups
appConfig = {};
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
            console.log(success.data);
            if(!err) {
                console.log("no error");
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
            appConfig = app;
            
        }
    });
    
    Session.set('Regions', appConfig.regions);
    Session.set('Groups', appConfig.groups);
    Session.set('Categories', appConfig.categorys);
    Session.set('Languages', appConfig.languages);
                
    Session.set("categoryList",
            _.map(Session.get('Categories'), 
                function(cat){
                    return cat.categoryName;
                }));
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
        
    } else {
       console.log('shudnt come here');
    }
});

   