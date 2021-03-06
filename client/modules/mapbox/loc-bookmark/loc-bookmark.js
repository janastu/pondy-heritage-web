//Render bookmarked locations in buttons on map
Template.LocBookmark.helpers({

    locations: function(){
        return Session.get('Regions');
    }
});


Template.LocBookmark.onRendered(function() {
    //bug fix for dropdown not working, issue #43
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
