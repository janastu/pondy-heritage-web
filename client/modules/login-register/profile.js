/* Global function to map and compact an array of features*/
var filtered = function(features, param){
 
  var mapped = _.map(features, function(feature){ 
                    if(param.group){
                        if(param.group == feature.properties.groupname){
                              return feature;
                          }
                          else if(param.group == "all"){
                            return feature;
                          }
                        }
                      else if(param.user){
                          if(param.user == feature.properties.user){
                              return feature;
                          }
                        }

                });
 
  return mapped;
}
//sort an array of features by date
var sortedFeatures = function(features){
 
   return _.sortBy(features, 
      'properties.uploadTime').reverse();
}
// compose filter, compact and sort
filterFeatures = _.compose(sortedFeatures, _.compact, filtered);

//human readable file size conversion

function humanFileSize(bytes) {
    return (Session.get('storageLimit')/ (1024*1024)).toFixed(2);
}

Template.myCards.helpers({
	content: function(){
    var filtered = filterFeatures(MAPP.GeoJson.get("Features").features, 
                    {group: Session.get('profileFilters') || 'all'});
		return filtered;
	},
	isOwner: function(arg){
  var user = Session.get('userSession').token.split(":")[0].trim();
  if(user === arg){
    return true
  }
},
isImage: function(arg){
  if(arg === "IMAGE"){
    return true;
  }
},
isVideo: function(arg){
  if(arg === "VIDEO"){
    return true;
  }
},
isText: function(arg){
   if(arg === "TEXT"){
    return true;
  }
}
});

Template.myCards.onRendered(function(){

    $('#show').on('click',function(){        
        $('.card-reveal').slideToggle('slow');
    });
    
    $('.card-reveal .close').on('click',function(){
        $('.card-reveal').slideToggle('slow');
    });
});

Template.myCards.events({
'click .delete-feature': function(event, template){
    event.preventDefault();
    MAPP.API.deleteFeature(event.target.getAttribute('data-id'));
   },
   'click .edit-feature': function(event, template){
    event.preventDefault();
    MAPP.API.editFeature(event.target.getAttribute('data-id'));
    console.log(event.target);
  }
});

Template.Profile.helpers({
  isOwner: function(){
  var user = Session.get('userSession').token.split(":")[0].trim();
  if(user){
    return true;
    }
  },
  userName: function(){
    return Session.get('userSession').token.split(":")[0].trim();;

  },
  storageConsumed: function(){
    return {
      inSi: humanFileSize(Session.get('storageLimit'))+" "+"MB",
      inPercent:humanFileSize(Session.get('storageLimit'))+"%"
    }
  
  },
  storageRemaining: function(){
    var consumed = humanFileSize(Session.get('storageLimit'));
    var remaining = 100.00-consumed;
    return remaining.toFixed(2)+"MB";
  }
});

Template.myCardHeader.helpers({
  userGroups: function(){
    return Session.get('Groups');
  },
  userPinCount: function(){
    return filterFeatures(MAPP.GeoJson.get("Features").features, 
                    {user: Session.get('userSession').token.split(":")[0] }).length;
  },
  groupFilterCount: function(){
    filtered = filterFeatures(MAPP.GeoJson.get("Features").features, 
                    {user: Session.get('userSession').token.split(":")[0] });
    return filterFeatures(filtered, {group: Session.get('profileFilters') || 'all'}).length;
  },
  groupString: function(){
    return Session.get('profileFilters');
  }
});


Template.myCardHeader.events({
  "change select": function(event, template){
    event.preventDefault();
   
    Session.set('profileFilters', event.target.value);
    
  }
});