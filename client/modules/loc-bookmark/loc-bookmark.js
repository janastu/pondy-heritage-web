         //Render bookmarked locations in buttons on map
 Template.LocBookmark.helpers({

        locations: function(){
            return Session.get('Regions');
        }
    });

 //Click on bookamrked location button should set map bounds
    Template.LocBookmark.events({

      'click li a': function(event){
        event.preventDefault();
       // change map bounding box, 
        switch(event.target.textContent.trim().toLowerCase()){
            case "puducherry":
            MAP.fitBounds(Session.get('Regions')[0].bounds);
            break;

            case "bahour":
            MAP.fitBounds(Session.get('Regions')[1].bounds);
            break;

            case "heritage-town":
            MAP.fitBounds(Session.get('Regions')[2].bounds);
            break;

            case "auroville":
            MAP.fitBounds(Session.get('Regions')[3].bounds);
            break;
            
        }
        

        }
    });
