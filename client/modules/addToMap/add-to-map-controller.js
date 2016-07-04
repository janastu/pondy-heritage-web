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

                	}, 10000);
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
	}
});


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

		/*else {
			fd.append("mediatype", "4");
			fd.append("picture", file);
		}*/
        
        
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
		fd.append("appId", appName);
        fd.append("groupId", event.target.group.value);
        fd.append("userName", userId);
        //new xmlhttp request
		var xhr = new XMLHttpRequest();
        
        //loader
		xhr.addEventListener("load", function(e){
			Session.set('uploadSpin', false);
			event.target.reset();
			//Session.set('uploadMedia', true);
			$('#add-heritage').modal('toggle');
			
			Bert.alert({
                    title: 'Upload Succes!',
                     message: 'Your pin is added to map!',
                    type: 'success',
                    style: 'growl-top-right',
                    icon: 'fa-check'
                });
			overlays.clearLayers();
			myLayer.loadURL(Meteor.settings.public.apis.getFeatures);
		});
		
		//posting to server endpoint
        xhr.open('POST', Meteor.settings.public.apis.postFeature);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //xhr.setRequestHeader("X-AUTH-TOKEN", Session.get('userSession').token.toString());
        Meteor.setTimeout(function(){
        	xhr.send(fd);
        }, 5000);
        
		xhr.addEventListener("error", function(e){
			Bert.alert({
                    title: 'Post Failed',
                     message: 'Something went wrong, try again!',
                    type: 'danger',
                    style: 'growl-top-right',
                    icon: 'fa-remove'
                });
			Session.set('uploadSpin', false);
			/*Meteor.setTimeout(function(){
				Session.set("errorAlert", true);

			}, 5000);*/
		});


	}
});
