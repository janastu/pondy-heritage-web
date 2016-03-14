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
            FlowLayout.render('MapEditor');
        } else {
            FlowRouter.go('/login');
        }
    }
});
FlowRouter.route('/map/:region', {
    action: function(params) {
        Session.set('region', params.region);
        FlowLayout.render('Layout', {content: 'Map', region: Session.get('region')});
    }
});
FlowRouter.route('/login', {
    action: function(params) {
        FlowLayout.render('Login');
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
                            console.log("error", err);
                        } else {
                            Session.set('userSession', result.data);
                            FlowRouter.go('/add-to-map');
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
                            console.log("error", err);
                        } else {
                            FlowRouter.go('/login/');
                        }
                    });
    }
});
if (Meteor.isClient) {
    Session.set('regionData', {name: "TOWN", id:2, lat:   11.935001,
        lng:   79.819558,
        zoom: 14});

    Session.set('Regions', [{name: "BAHOUR", id:1, lat:  11.803506,
        lng:  79.738941,
        zoom: 17},
        {name: "TOWN", id:2, lat:   11.935001,
            lng:   79.819558,
            zoom: 17},
            {name: "AUROVILLE", id:3, lat:  12.006833 ,
                lng:  79.810513,
                zoom: 17}]);

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
                Meteor.http.call("GET","http://pondy.openrun.com:8080/heritageweb/api/allGeoTagHeritageEntitysGeoJson",
                        function(err, response){
                            if(err){
                                console.log("error in getting geo json", err);
                            } else {
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
                                            content = '<h2>'+feature.properties.title+'</h2>' +
                                                '<p><a href="'+feature.properties.url+'" data-toggle="lightbox"> <img class="img-responsive" style="width:280px;" src="' +
                                                feature.properties.url+ '" /></a>'+feature.properties.description+'</p>';
                                            break;
                                        case 'VIDEO':
                                            content = '<h2>'+feature.properties.title+'</h2>' + '<p><video style="width:280px;" controls autobuffer>'+
                                                '<source src="'+feature.properties.url+'"type=""/> <code>Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="'+
                                                feature.properties.url+'">download it</a> and watch it with your favorite video player!</code></video>'+
                                                feature.properties.description+'</p>';
                                            break;
                                        case 'AUDIO':
                                            content = '<h2>'+feature.properties.title+'</h2>' + '<p><audio style="width:280px;" controls autobuffer>'+
                                                '<source src="'+feature.properties.url+'"type=""/> <code>Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="'+
                                                feature.properties.url+'">download it</a> and watch it with your favorite video player!</code></audio>'+
                                                feature.properties.description+'</p>';
                                            break;

                                    }
                                    marker.bindPopup(content);
                                });
                                myLayer.setGeoJSON(response.data.features)
                                    .addTo(map);
                            }
                        });
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
            /* should integrate leaflet bookmarks plugin for this*/
            var mapClickText = event.target.textContent.trim().toUpperCase();
            var Regions = Session.get('Regions');
            var mapClickData = {};

            for (i=0; i<Regions.length; i++){

                if (Regions[i].name == mapClickText){
                    //Session.set('LATLNG', Regions[i]);
                    mapClickData = Regions[i];
                }
            }
            Session.set('regionData', mapClickData);
            FlowRouter.go('/map/'+event.target.textContent.trim().toLowerCase());
        }
    });
    Template.Login.events({
        'submit form': function(event){
            event.preventDefault();
            Meteor.call('Login', {username: event.target.username.value, password: event.target.password.value})
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
    Template.Register.events({
        'submit form': function(event){
            event.preventDefault();
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
    Template.AddToMap.helpers({
        latlng: function() {
            return Session.get('mapClick');
        }
    });
    Template.AddToMap.events({
        'submit form': function(event, template){
            event.preventDefault();
            var file = template.find('input:file').files[0];
            var lat = Session.get('mapClick').lat;
            var lng = Session.get('mapClick').lng;
            var fd = new FormData();
            fd.append("title", event.target.title.value);
            fd.append("description", event.target.description.value);
            fd.append("latitude", lat);
            fd.append("longitude", lng);
            fd.append("category", event.target.category.value);
            fd.append("mediatype", event.target.mediatype.value);
            fd.append("language", event.target.language.value);
            fd.append("picture", file);
            var xhr = new XMLHttpRequest;
            xhr.open('POST', 'http://pondy.openrun.com:8080/heritageweb/api/createAnyMediaGeoTagHeritageFromWeb', true);
            xhr.send(fd);
        }
    });
}



