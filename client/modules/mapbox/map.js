//Global scripts, variables and Session items

    //to add lightbox for the map popup box in this view
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
    //Session variable for error alert when signin fails
    Session.set("errorAlert", false);

    //Bookmarked regions with bound data
    //set sesstion variable after api request completed
    window.allApps = {};
    HTTP.get(Meteor.settings.public.apis.getApps, function(err, success) {
        console.log(success.data);
        if(success) {
            console.log("no error");
            allApps = success.data;
            Session.set('Regions', allApps[0].regions);
            Session.set('Groups', allApps[0].groups);
            Session.set('Categories', allApps[0].categories);
        } else {
            console.log("error getting apps", err);
        }
});

    /*Session.set('Regions', [
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
            }]);*/

 Template.Map.onRendered(function () {
    Mapbox.debug = true;
    Mapbox.load({
        plugins: ['markercluster', 'heat', 'draw']
    });
    this.autorun(function () {
        if (Mapbox.loaded()) {
                L.mapbox.accessToken = 'pk.eyJ1IjoicGF1bG9ib3JnZXMiLCJhIjoicFQ1Sll5ZyJ9.alPGD574u3NOBi2iiIh--g';
                var map = L.mapbox.map('map', 'mapbox.pirates')
                .setView([11.972157926492702, 79.81773376464844], 12)
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

//Load map features from api url
myLayer.loadURL(Meteor.settings.public.apis.getFeatures);

                 // Since featureLayer is an asynchronous method, we use the `.on('ready'`
// call to only use its marker data once we know it is actually loaded.
myLayer.on('ready', function(e) {
    // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
    var clusterGroup = new L.MarkerClusterGroup();
    e.target.eachLayer(function(layer) {
        clusterGroup.addLayer(layer);
    });
    map.addLayer(clusterGroup);
});


                //if user is logged in, add draw controls to add marker
                if(Session.get('userSession')){


                   var featureGroup = L.featureGroup().addTo(map); 

                    //initialize draw control without shapes buttons
                    var drawControl = new L.Control.Draw({
                        draw:{         

                            polyline: false, 
                            polygon: false, 
                            circle: false, 
                            rectangle:false
                        },
                        edit: {featureGroup: featureGroup}
                    }).addTo(map);
            //declaring global context to disable upon signout
            window.DRAWCNTRL = drawControl;
            // Set the button title text for the marker button
            L.drawLocal.draw.toolbar.buttons.marker = 'Draw a sexy marker!';
            map.on('draw:created', function(e) {
                var marker = e.layer;
                var popupContent = "<p>Click on <b>ADD TO MAP</b> button to add picture, video, audio and text to the map location</p>";
                marker.bindPopup(popupContent);
                featureGroup.addLayer(marker);
                e.layer.openPopup();
                var latlng = marker.getLatLng();
                Session.set('mapClick', latlng);

            });


        }

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
