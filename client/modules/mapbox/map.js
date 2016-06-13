//Global scripts, variables and Session items

    //to add lightbox for the map popup box in this view
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
    //bootstarp dropdown call
   
    //Session variable for error alert when signin fails
    Session.set("errorAlert", false);

    //Bookmarked regions with bound data
    //set sesstion variable after api request completed
    window.allApps = {};
   /* HTTP.get(Meteor.settings.public.apis.getApps, function(err, success) {
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
});*/


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
        //for testing geojson
 GeoJson = window.GeoJson;
 Meteor.http.call("GET", Meteor.settings.public.apis.getFeatures, function(err, res){
    //this.unblock();
    if(!err){
        GeoJson = res.data;
    } else {
        GeoJson = null;
    }
});
 

 overlays = L.layerGroup().addTo(map);
                    myLayer = L.mapbox.featureLayer();



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
                                        '<div class="map-content"><a href="'+feature.properties.url+'" data-toggle="lightbox"> <img class="img-responsive" style="width:280px;" src="' +
                                        feature.properties.url+ '" /></a>'+'<h2>'+feature.properties.title+'</h2>' +
                                        feature.properties.description+'</div>';
                                        break;
                                        case 'VIDEO':
                                        content = '<div class="map-content"> <p><video style="width:280px;" controls autobuffer>'+
                                        '<source src="'+feature.properties.url+'"type=""/> <code>Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="'+
                                        feature.properties.url+'">download it</a> and watch it with your favorite video player!</code></video>'+
                                        '<h2>'+feature.properties.title+'</h2>' + feature.properties.description+'</div>';
                                        break;
                                        case 'AUDIO':
                                        content =  '<div class="map-content"><audio style="width:280px;" controls autobuffer>'+
                                        '<source src="'+feature.properties.url+'"type=""/> <code>Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="'+
                                        feature.properties.url+'">download it</a> and watch it with your favorite video player!</code></audio>'+
                                        '<h2>'+feature.properties.title+'</h2>' +feature.properties.description+'</div>';
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
//L.map.setGeoJSON(GeoJson);
                 // Since featureLayer is an asynchronous method, we use the `.on('ready'`
// call to only use its marker data once we know it is actually loaded.
myLayer.on('ready', function(e) {
   
    overlays.clearLayers()
    

     // create a new MarkerClusterGroup that will show special-colored
    // numbers to indicate the category
    function makeGroup(color) {
      return new L.MarkerClusterGroup({
        /*iconCreateFunction: function(cluster) {
          return new L.divIcon({
           
            iconSize: [20, 20],
            html: '<div style="text-align:center;color:#fff;background:' +
            color + '">' + cluster.getChildCount() + '</div>'
          });
        }*/
        iconCreateFunction: function(cluster) {
        return L.mapbox.marker.icon({
          // show the number of markers in the cluster on the icon.
          'marker-symbol': cluster.getChildCount(),
          'marker-color': color.toString()
        });
      }
      }).addTo(overlays);
    }
    // create a marker cluster group for each category
    var groups = {
      "Built Heritage": makeGroup('#d24646'),
      "Urban Life": makeGroup('#f97352'),
      "Intangible Cultural Heritage": makeGroup('#FFEB3B'),
      "French Influence": makeGroup('#536DFE'),
      "Tamil Culture": makeGroup('#FF5722'),
      "Natural Heritage": makeGroup('#00796B'),
      "Spiritual Practice": makeGroup('#FFC107'),
      "Village Life": makeGroup('#F44336')
    };
    
     // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
    var clusterGroup = new L.MarkerClusterGroup();
    e.target.eachLayer(function(layer) {
      // add each rail station to its specific group.
            var data;
            //var data = ["Built Heritage", "Urban Life", "Intangible Cultural Heritage", "French Influence", 
            //"Tamil Culture", "Natural Heritage", "Spiritual Practice"];
            if(!Session.get("categoryFilter")) {
            data =  Session.get("categoryList");
          } else {
            data = Session.get("categoryFilter");

          }
            if(data){
        if (data.indexOf(layer.feature.properties.category) !== -1) {
            
            groups[layer.feature.properties.category].addLayer(layer);
        }
        }
   

    });

  
  

    //map.addLayer(myLayer);


//side bar for geo json data
                                      //TODO: needs more tweaking
    myLayer.eachLayer(function(layer) {
     var listings = document.getElementById('listings');
                                    var listing = listings.appendChild(document.createElement('div'));
                                    listing.className = 'item';

                                    var link = listing.appendChild(document.createElement('a'));
                                    link.href = '#';
                                    link.className = 'title';
                                    link.innerHTML = '<h3>'+layer.toGeoJSON().properties.title+'</h3>';
                                    var description = listing.appendChild(document.createElement('p'));

                                    description.innerHTML = '<p>'+layer.toGeoJSON().properties.description+'</p>';

                                    link.onclick = function() {
                                     // 1. Toggle an active class for `listing`. View the source in the demo link for example.

                                    // 2. When a menu item is clicked, animate the map to center
                                    // its associated locale and open its popup.
                                    console.log(layer);
                                     map.setView(layer.getLatLng(), 16);
                                     //map.panTo(marker.getLatLng());
                                     layer.openPopup();
                                }
                            });

   

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


