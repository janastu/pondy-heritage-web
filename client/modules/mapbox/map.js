//Global scripts, variables and Session items

    //to add lightbox for the map popup box in this view
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
    //Session variable for error alert when signin fails
    Session.set("errorAlert", false);

    //region centre for initial view setting onload

    

 //Bookmarked regions with bound data
 Session.set('Regions', [
    {name: "MADIKERI",
    id:1, lat:  12.447975,
    lng:   75.979728,
    zoom: 16,
    bounds: [[12.447975, 75.979728], [12.121907, 75.612373]]
},

{name: "MYSORE", 
id:2, 
lat:  12.906859,
lng:  77.1123504,
zoom: 16, 
bounds: [[12.906859, 77.1123504], [11.921103, 76.308975 ]]
},
{name: "BHAVANI", id:3, lat:   12.162855,
lng:   78.240509,  
zoom: 16,
bounds: [[12.162855, 78.240509], [10.674103, 77.471466]]
}, 
{name: "POOMPUHAR", id:4, lat:  11.501556 ,
lng:  80.023040,
zoom: 16,
bounds: [[11.501556, 80.023040], [10.352747, 78.287200]]
}]);

 Template.Map.onRendered(function () {
    Mapbox.debug = true;
    Mapbox.load({
        plugins: ['markercluster', 'heat', 'draw']
    });
    this.autorun(function () {
        if (Mapbox.loaded()) {
                
                L.mapbox.accessToken = 'pk.eyJ1IjoicGF1bG9ib3JnZXMiLCJhIjoicFQ1Sll5ZyJ9.alPGD574u3NOBi2iiIh--g';
                var map = L.mapbox.map('map', 'mapbox.pirates')
                .setView([13.127629, 79.747009], 12)
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

myLayer.loadURL('http://196.12.53.138:8080/heritageweb/api/mapp');
//.addTo(map);

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
