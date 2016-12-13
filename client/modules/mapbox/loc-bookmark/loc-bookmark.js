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
        var dataForLoc = _.find(Session.get('Regions'), function(region){
          if(region.name === event.target.textContent.trim()){
            return region;
          }
        });
        console.log(dataForLoc);
        MAP.fitBounds([[dataForLoc.bottomLatitude, dataForLoc.bottomLongitude], [dataForLoc.topLatitude, dataForLoc.topLongitude]]);
        }
    });
