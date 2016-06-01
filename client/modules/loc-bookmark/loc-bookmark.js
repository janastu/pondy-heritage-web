//Render bookmarked locations in buttons on map
Template.LocBookmark.helpers({

    locations: function(){
        HTTP.get(Meteor.settings.public.apis.getApps, function(err, success) {
            console.log(success.data);
            if(success) {
                console.log("no error");
                allApps = success.data;
                Session.set('Regions', allApps[0].regions);
                Session.set('Groups', allApps[0].groups);
                Session.set('Categories', allApps[0].categories);
                //return allApps[0].regions;
            } else {
                console.log("error getting apps", err);
            }
        });

        return Session.get('Regions');
    }
});


Template.LocBookmark.onRendered(function() {
     $('.dropdown-toggle').dropdown();
});
 //Click on bookamrked location button should set map bounds
    Template.LocBookmark.events({

      'click li a': function(event){
        event.preventDefault();
        //get the map bounds from Session variable
       var pondytown = [[Session.get('Regions')[0].bottomLatitude, Session.get('Regions')[0].bottomLongitude], [Session.get('Regions')[0].topLatitude, Session.get('Regions')[0].topLongitude]];
       var auroville = [[Session.get('Regions')[1].bottomLatitude, Session.get('Regions')[1].bottomLongitude], [Session.get('Regions')[1].topLatitude, Session.get('Regions')[1].topLongitude]]
       console.log(pondytown);
       var bahour = [[Session.get('Regions')[2].bottomLatitude, Session.get('Regions')[2].bottomLongitude], [Session.get('Regions')[2].topLatitude, Session.get('Regions')[2].topLongitude]];
       // change map bounding box, 
        switch(event.target.textContent.trim().toLowerCase()){
            case "pondytown":
            MAP.fitBounds(pondytown);
            //MAP.fitBounds(Session.get('Regions')[0].bounds);
            break;

            case "bahour":
            MAP.fitBounds(bahour);
            break;

            case "heritage-town":
            MAP.fitBounds(Session.get('Regions')[2].bounds);
            break;

            case "auroville":
            MAP.fitBounds(auroville);
            //MAP.fitBounds(Session.get('Regions')[3].bounds);
            break;
        }

        }
    });
