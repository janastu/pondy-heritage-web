//Add To map Controller

Template.AddToMapBtn.helpers({
	userLogged: function(){
		return Session.get('userSession');
	}

});
Template.AddToMapBtn.events({
	'click #add-to-map': function(event){
		event.preventDefault();
		if(Session.get('userSession')){
                //FlowRouter.go('/add-to-map');
                if(Session.get('mapClick')){
                	$('#add-heritage').modal({show: true});
                } else {

                	Session.set('markerAlert', true);
                	Meteor.setTimeout(function(){
                		Session.set("markerAlert", false);

                	}, 5000);
                }
            } else {
            	Router.go('login.static');
            }
        }
    });



Template.AddToMapDialog.helpers({
	latlng: function() {
		return Session.get('mapClick');
	},
	loaded: function() {
		return Session.get('uploadSpin');
	},
	categories: function() {
		return Session.get('Categories');
	},
	languages: function() {
		return Session.get('Languages');
	},
	//user group info resets on refresh if the user tries to post
	groupInfo: function() {
		    // user session if saved in browser session storage
		if(sessionStorage.userGroups){
            var userGroups = JSON.parse(sessionStorage.userGroups);
            Session.set('Groupinfo', userGroups);
            

}
			return Session.get('Groupinfo');
	},
	editState:function(){
		return Session.get('editFeature');
	}
});

Template.AddToMapDialog.rendered = function(){
	
	$('#add-heritage').on('hide.bs.modal', function (e) {
		console.log("cancelled");
  		$('#groupInfo option:selected').attr('selected', false);
  		$('#category option:selected').attr('selected', false);
  		$('#language option:selected').attr('selected', false);
	});
 	$('#add-heritage').on('shown.bs.modal', function(e){
 		var editable = Session.get('editFeature');
 		console.log("shown", editable);
		$('#groupinfo option[value='+'"'+editable.properties.groupname+'"'+']').attr("selected", "selected");
    	$('#category option[value='+'"'+editable.properties.category+'"'+']').attr("selected", "selected");
    	$('#language option[value='+'"'+editable.properties.language+'"'+']').attr("selected", "selected");
    });

};
Template.AddToMapDialog.events({
	
	'submit form': function(event, template){
		event.preventDefault();
		Session.set('uploadSpin', true);
        
        var userId = Session.get('userSession').token.split(":")[0].trim().toString();
       
        var lat = Session.get('mapClick').lat;
        var lng = Session.get('mapClick').lng;
        //create multiform data
		var fd = new FormData();
		//extract file from dom
		var file = template.find('input:file').files[0];
		
		//find file mediatype to add to request data
		if(file == undefined) {
			file = new File(["%PNG\r\n"], 'empty.png');
			if(event.target.url.value){
				//mediatype 3 is for video
				fd.append("mediatype", "3");
    		} else {
    			//mediatype 4 is for text
    			fd.append("mediatype", "4");
				
    		}
			fd.append("picture", file);	
		}      
		 else if(file.type){
			var mediaType = file.type.split("/")[0];
			switch(mediaType){

				case "image":
				fd.append("mediatype", "1");
				break;

				case "audio":
				fd.append("mediatype", "2");
				break;

				case "video":
				fd.append("mediatype", "3");
				break;
			}
			fd.append("picture", file);

		}
      
        
        fd.append("title", event.target.title.value);
        fd.append("description", event.target.description.value);
		fd.append("latitude", lat);
		fd.append("longitude", lng);
		fd.append("category", event.target.category.value);
		fd.append("language", event.target.language.value);
		//fd.append("picture", file);
        fd.append("uploadTime", new Date().toString());
        
        //is empty now
        fd.append("fileOrURLLink", event.target.url.value);
       
        fd.append("userAgent", null);
        //credentials from config file
		fd.append("appId", MAPP.appName);
        fd.append("groupId", event.target.group.value);
        fd.append("userName", userId);
        //call the posting function
        MAPP.API.postToServer(fd);
        //reset form
        event.target.reset();

	}
});
