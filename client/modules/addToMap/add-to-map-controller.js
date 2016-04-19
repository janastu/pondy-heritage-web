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
	}
});


Template.AddToMapDialog.events({
	'submit form': function(event, template){
		event.preventDefault();
		Session.set('uploadSpin', true);
        window.heritageUser = {};
        var userId = Session.get('userSession').token.split(":")[0].trim();
		var fd = new FormData();
		var file = template.find('input:file').files[0];
		if(file.type){
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

		}                                                                                                                                                                                                             
		else {
			fd.append("mediatype", "4");
		}
        var lat = Session.get('mapClick').lat;
        var lng = Session.get('mapClick').lng;
        //create multiform data
        fd.append("title", event.target.title.value);
        fd.append("description", event.target.description.value);
		fd.append("latitude", lat);
		fd.append("longitude", lng);
		fd.append("category", "Built-Heritage");//event.target.category.value);
		fd.append("language", event.target.language.value);
		fd.append("picture", file);
        fd.append("uploadTime", new Date().toString());
        fd.append("userAgent", "dummy");
        fd.append("fileOrURLLink", "");
		var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
                console.log("status code =", xhr.status, "readystate =", xhr.readyState, xhr, new Date);
        }
		xhr.addEventListener("load", function(e){
			Session.set('uploadSpin', false);
			event.target.reset();
			Session.set('uploadMedia', true);
			$('#add-heritage').modal('toggle');
			Meteor.setTimeout(function(){
				Session.set("uploadMedia", false);

			}, 5000);
		});
        HTTP.get(Meteor.settings.public.apis.getUser+userId, function(error, success) {
            if(success) {
                Session.set('heritageUser', success.data.id.toString());
            }
        });
        xhr.open('POST', Meteor.settings.public.apis.postFeature+'user/'+Session.get('heritageUser')+'/group/1', true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-AUTH-TOKEN", Session.get('userSession').token.toString());
        console.log(Session.get('heritageUser'), fd);
        xhr.send(fd);
		xhr.addEventListener("error", function(e){
			Session.set('uploadSpin', false);
			Meteor.setTimeout(function(){
				Session.set("errorAlert", true);

			}, 5000);
		});


	}
});
