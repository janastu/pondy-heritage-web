Template.myCards.helpers({
	content: function(){
		//var filters = Session.get('categoryFilter');
		//var groupFilter = Session.get('groupFilter');
		var featuresByDate = _.sortBy(MAPP.GeoJson.get("Features").features, 
		  'item.properties.uploadTime').reverse();
		/*filteredFeatures = _.compact(_.map(featuresByDate, function(item) {
		  if(filters.indexOf(item.properties.category) !== -1 && groupFilter.indexOf(item.properties.groupname) !== -1){
		    
		    return item
		  } 
		}));*/
		return featuresByDate;
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