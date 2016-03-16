FlowRouter.route('/', {
    action: function(params) {
        FlowLayout.render('pondyHome');
    }
});
FlowRouter.route('/about', {
    action: function(params) {
        FlowLayout.render('about');
    }
});
FlowRouter.route('/instructions', {
    action: function(params) {
        FlowLayout.render('Instructions');
    }
});
FlowRouter.route('/contact', {
    action: function(params) {
        FlowLayout.render('contact');
    }
});
FlowRouter.route('/download', {
    action: function(params) {
        FlowLayout.render('Download');
    }
});
FlowRouter.route('/map', {
    action: function(params) {
        FlowLayout.render('Layout', {content: 'Map'});
        //to add lightbox for the map popup box in this view
        return $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
                event.preventDefault();
                    $(this).ekkoLightbox();
        });
    }
});
FlowRouter.route('/add-to-map', {
    action: function(params) {
       if(Session.get('userSession')){
        FlowLayout.render('Layout', {content:'MapEditor'});
      } else {
        FlowRouter.go('/login');
      }
    }
});
/*FlowRouter.route('/map/:region', {
    action: function(params) {
      FlowLayout.render('Layout', {content: 'Map'});
  }
  });*/
  FlowRouter.route('/login', {
    action: function(params) {
        FlowLayout.render('Login');
        Session.set('showDialog', false);
    }
});
FlowRouter.route('/register', {
    action: function(params) {
        FlowLayout.render('Register');
    }
});
Meteor.methods({
    heritagGeoJson: function(){
        this.unblock();
        var response = Meteor.http.call("GET","http://pondy.openrun.com:8080/heritageweb/api/allGeoTagHeritageEntitysGeoJson", 
          function(result){
            if(result){
              return result;
            }
          });
        return response;
  },
  Login: function(request){

    var response = Meteor.http.call("POST", "http://pondy.openrun.com:8080/heritageweb/api/authenticate", 
      {content: 'username='+request.username+'&'+'password='+request.password, 
      headers:{"Content-Type":"application/x-www-form-urlencoded", "Accept":"application/json"}}, 
      function(err, result){
        if(err){
            Session.set("errorAlert", true);
            Session.set('loginSpinner', false);
            Meteor.setTimeout(function(){
                Session.set("errorAlert", false);

            }, 5000);
        } else {
          console.log("result", result.data);
          Session.set('userSession', result.data);
          FlowRouter.go('/add-to-map');
          Session.set('loginSpinner', false);
          Session.set('showDialog', true);
        }
      });
  },
  Register: function(request){
  var response = Meteor.http.call("POST", "http://pondy.openrun.com:8080/heritageweb/api/registerForMobile", 
      {content: 'username='+request.username+'&'+'password='+request.password+'&'+
      'emailId='+request.emailId+'&'+
      'residentstatus='+request.residentstatus+'&'+
      'agestatus='+request.agestatus+'&'+
      'specialmessage='+request.specialmessage,
      headers:{'Content-Type':'application/x-www-form-urlencoded', 'Accept':"application/json"}},
      function(err, result){
        if(err){
          Session.set("errorAlert", true);
          Session.set('loginSpinner', false);
            Meteor.setTimeout(function(){
                Session.set("errorAlert", false);

            }, 5000);
          
          
        } else {
         
            FlowRouter.go('/login/');
          Session.set('registerSpinner', false);
        }

      });

  }
  });
  if (Meteor.isClient) {
    Session.set("errorAlert", false);
    Session.set('regionData', {name: "TOWN", id:1, lat:   11.935001,
            lng:   79.819558,
            zoom: 14});

    Session.set('Regions', [
        {name: "PUDUCHERRY",
         id:1, lat:  11.920013,
        lng:   79.812646,
        zoom: 16,
        bounds: [[11.916318, 79.797196], [11.921021, 79.833417]]
    },

        {name: "BAHOUR", 
        id:2, 
        lat:  11.803506,
        lng:  79.738941,
        zoom: 16, 
        bounds: [[11.806473, 79.735429], [11.806725, 79.768130]]
        },
        {name: "HERITAGE-TOWN", id:3, lat:   11.935001,
                   lng:   79.819558,  
                   zoom: 16,
                   bounds: [[11.936959, 79.825194], [11.940464, 79.833584]]
               }, 
                   {name: "AUROVILLE", id:4, lat:  12.006833 ,
                   lng:  79.810513,
                   zoom: 16,
                    bounds: [[12.004984, 79.788036], [12.007335, 79.833011]]
                }]);

    Template.Map.onRendered(function () {
        Mapbox.debug = true;
        Mapbox.load({
            plugins: ['markercluster', 'heat', 'directions']
        });
        this.autorun(function () {
            if (Mapbox.loaded()) {
                //need help
                //set view on map should be dynamic based on regions data from server
                var regData = Session.get('regionData');
                L.mapbox.accessToken = 'pk.eyJ1IjoicGF1bG9ib3JnZXMiLCJhIjoicFQ1Sll5ZyJ9.alPGD574u3NOBi2iiIh--g';
                var map = L.mapbox.map('map', 'mapbox.pirates')
                    .setView([regData.lat, regData.lng], regData.zoom)
                    .addControl(L.mapbox.geocoderControl('mapbox.places', 'autocomplete'));
                    //global context for map object to change bounding box
                    window.MAP=map;


                 var myLayer = L.mapbox.featureLayer();
                                   
                                // Set a custom icon on each marker based on feature
                                // properties.
                                myLayer.on('layeradd', function(e) {
                                    var marker = e.layer,
                                    feature = marker.feature;
                                    var content = "";
                                    //identifying content type to build templates accordingly
                                    //for map popup on marker click
                                    //should enhance this feature to
                                    //hover and show in side panel
                                    switch(feature.properties.mediatype) {
                                        case 'IMAGE':
                                            content = 
                                                '<p><a href="'+feature.properties.url+'" data-toggle="lightbox"> <img class="img-responsive" style="width:280px;" src="' +
                                                feature.properties.url+ '" /></a>'+'<h2>'+feature.properties.title+'</h2>' +
                                                feature.properties.description+'</p>';
                                            break;
                                        case 'VIDEO':
                                            content = '<p><video style="width:280px;" controls autobuffer>'+
                                                '<source src="'+feature.properties.url+'"type=""/> <code>Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="'+
                                                feature.properties.url+'">download it</a> and watch it with your favorite video player!</code></video>'+
                                                '<h2>'+feature.properties.title+'</h2>' + feature.properties.description+'</p>';
                                            break;
                                        case 'AUDIO':
                                            content =  '<p><audio style="width:280px;" controls autobuffer>'+
                                                '<source src="'+feature.properties.url+'"type=""/> <code>Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="'+
                                                feature.properties.url+'">download it</a> and watch it with your favorite video player!</code></audio>'+
                                                '<h2>'+feature.properties.title+'</h2>' +feature.properties.description+'</p>';
                                            break;

                                    }
                                    marker.bindPopup(content);
                                });

//center map position when user clicks on marker
                     /*myLayer.on('click', function(e) {
                                    map.panTo(e.layer.getLatLng());
                                    
        
                                     });*/

myLayer.on('popupopen', function(e) {
    var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.popup._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px),{animate: true}); // pan to new center
    
});
//Get pondycherry heritage data from server - using mapbox loadurl method
                myLayer.loadURL('http://pondy.openrun.com:8080/heritageweb/api/allGeoTagHeritageEntitysGeoJson')
                .addTo(map);
           
          
            }
        });

    });

    Template.Map.helpers({
        html: '<div id="map" class="mapbox"></div>',
        js:   'Mapbox.load();\nTracker.autorun(function () {\n' +
            '\tif (Mapbox.loaded()) {\n' +
                '\t\tL.mapbox.accessToken = MY_ACCESS_TOKEN;\n' +
                    '\t\tvar map = L.mapbox.map("map", MY_MAP_ID);\n' +
                    '\t}\n' +
                    '});'

    });
    Template.MapEditor.onRendered(function () {
        Mapbox.debug = true;
        Mapbox.load({
            plugins: ['markercluster', 'heat']
        });
        this.autorun(function () {
            if (Mapbox.loaded()) {
                L.mapbox.accessToken = 'pk.eyJ1IjoicGF1bG9ib3JnZXMiLCJhIjoicFQ1Sll5ZyJ9.alPGD574u3NOBi2iiIh--g';
                var map = L.mapbox.map('map', 'mapbox.pirates')
                    .setView([11.935001, 79.819558], 14)
                    .addControl(L.mapbox.geocoderControl('mapbox.places', 'autocomplete'));

                var marker = L.marker([11.935001, 79.819558], {
                    icon: L.mapbox.marker.icon({
                        'marker-color': '#f86767',
                        "marker-symbol": "star"
                    }),
                    draggable: true
                }).addTo(map);

                // every time the marker is dragged, update the coordinates container
                marker.on('dragend',  function(event){
                    var latlng = marker.getLatLng();
                    Session.set('mapClick', latlng);
                    $('#add-heritage').modal({show: true});
                });
            }
        });
    });
    Template.MapEditor.helpers({
        html: '<div id="mapedit" class="mapbox"></div>',
        js:   'Mapbox.load();\nTracker.autorun(function () {\n' +
            '\tif (Mapbox.loaded()) {\n' +
                '\t\tL.mapbox.accessToken = MY_ACCESS_TOKEN;\n' +
                    '\t\tvar map = L.mapbox.map("map", MY_MAP_ID);\n' +
                    '\t}\n' +
                    '});'

    });
    Template.mapState.helpers({

        locations: function(){
            return Session.get('Regions');
        }
    });
    Template.mapState.events({

      'click li button': function(event){
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
    Template.Login.events({
      'submit form': function(event){
        event.preventDefault();
        Session.set('loginSpinner', true);
        Meteor.call('Login', {username: event.target.username.value, password: event.target.password.value});
      }
    });
    Template.userState.helpers({
        userLogged: function(){
            return Session.get('userSession');
        }

    });
    Template.userState.events({
        'click #add-to-map': function(event){
            event.preventDefault();
            if(Session.get('userSession')){
                FlowRouter.go('/add-to-map');
            } else {
                FlowRouter.go('/login');
            }
        }
    });
    Template.Register.helpers({
        loaded: function() {
            return Session.get('registerSpinner');
        }
    });
    Template.Register.events({
      'submit form': function(event){
        event.preventDefault();
          Session.set('registerSpinner', true);
        Meteor.call('Register', {
          username: event.target.username.value, 
          password: event.target.password.value, 
          emailId: event.target.email.value,
          residentstatus: event.target.residentStatus.value,
          agestatus: event.target.ageGroup.value,
          specialmessage: event.target.specialmessage.value
        });
      }
    });
    Template.body.helpers({
        showDialog: function() {
            return Session.get('showDialog');
            
        }
        
    });
    Template.Alerts.helpers({
        
        userSession: function(){
            if(Session.get('userSession')){
                var userStr = Session.get('userSession').token;
                var usrArray = userStr.split(":");
                return {"loggedUser": usrArray[0]};
                
            }
        }
});
    Template.dismissibleAlert.helpers({

        errorAlert: function() {
            return Session.get('errorAlert');

        },
        uploadMedia: function(){
            return  Session.get('uploadMedia');
        }
    });
    Template.AddToMap.helpers({
        latlng: function() {
            return Session.get('mapClick');
        },
        loaded: function() {
            return Session.get('uploadSpin');
        }
    });
    Template.AddToMap.events({
        'submit form': function(event, template){
            event.preventDefault();
            Session.set('uploadSpin', true);
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
           
            
            
            fd.append("title", event.target.title.value);
            fd.append("description", event.target.description.value);
            fd.append("latitude", lat);
            fd.append("longitude", lng);
            fd.append("category", event.target.category.value);
            
            fd.append("language", event.target.language.value);
            fd.append("picture", file);
            var xhr = new XMLHttpRequest;
            xhr.addEventListener("load", function(e){
                Session.set('uploadSpin', false);
                event.target.reset();
                Session.set('uploadMedia', true);
                $('#add-heritage').modal('toggle');
                Meteor.setTimeout(function(){
                Session.set("uploadMedia", false);

            }, 5000);
            });
            xhr.open('POST', 'http://pondy.openrun.com:8080/heritageweb/api/createAnyMediaGeoTagHeritageFromWeb', true);
            xhr.send(fd);

            xhr.addEventListener("error", function(e){
                Session.set('uploadSpin', false);
                Meteor.setTimeout(function(){
                Session.set("errorAlert", true);

            }, 5000);
            });


        }
    });
}



