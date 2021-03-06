Template.EditFeatureModal.helpers({
	editState:function(){
		return Session.get('editFeature');
	},
	categorySelected: function(categoryLabel){
		
		return (Session.get('editFeature').properties.category === categoryLabel) ? 'selected' : '';
	},
	groupSelected: function(groupLabel){
		
		return (Session.get('editFeature').properties.groupName === groupLabel) ? 'selected' : '';
	},
	languageSelected: function(lang){
		//TODO: no lang property to refer to -> defaults to english
		return (Session.get('editFeature').properties.groupName === lang) ? 'selected' : '';
	},
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

Template.EditFeatureModal.events({
	
	'submit form': function(event, template){
		event.preventDefault();
		window.testE = event.target;
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