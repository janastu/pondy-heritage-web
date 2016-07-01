//Global scripts, variables and Session items

//to add lightbox for the map popup box in this view
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
});
    //bootstarp dropdown call
   
//click handler to scroll to card when marker is clicked
updateSidebarView = function(marker){
  var $sidebarParent = $('#listings');
  var $sideBarElements = $('#listings .item');
  var $scrollToEl = _.find($sideBarElements, function(item) { 
    if($(item).data('id') == marker.feature.id){
      return $(item);
    }
  
  });
  
   /* $sidebarParent.animate({
        scrollTop: $($scrollToEl).offset().top
    }, 2000);*/
  //scrollToEl.scrollIntoView({block: "start", behavior: "smooth"});
}


// Add map base layer - map theme and set view
 addBaseLayer = function(){
                var map = L.mapbox.map('map', Meteor.settings.public.appConfig.tileLayer)
                .setView(Meteor.settings.public.appConfig.mapInitialView, 12)
                .addControl(L.mapbox.geocoderControl('mapbox.places', 'autocomplete'));
                    //global context for map object to change bounding box
                   return window.MAP=map;
            }



      //if user is logged in, add draw controls to add marker

addDrawControl = function(map){
  
                
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
                    }).addTo(baselayer);
                      //declaring global context to disable upon signout
            window.DRAWCNTRL = drawControl;
           //Draw control for adding markers by logged in user
            
            // Set the button title text for the marker button
            L.drawLocal.draw.toolbar.buttons.marker = 'Draw a marker on the map!';
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

 Template.Map.onRendered(function () {
    Mapbox.debug = true;
    Mapbox.load({
        plugins: ['markercluster', 'heat', 'draw']
    });
    this.autorun(function () {

        if (Mapbox.loaded()) {
         // Add base layer 
           L.mapbox.accessToken = Meteor.settings.public.appConfig.mapBoxToken;
          
      baselayer = addBaseLayer();
      //check logged in status and add draw control
        addDrawControl(MAP);   

        // Feature layer to load GeoJson from api server
                    myLayer = L.mapbox.featureLayer();//.addTo(MAP);

        //Marker cluster group - to add grouped features
                   overlays = L.layerGroup().addTo(baselayer);




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
                                        '<div class="map-content"><a href="'+feature.properties.url+'" data-toggle="lightbox" data-title="'+
                                        feature.properties.title+'"> <img class="img-responsive"  src="' +
                                        feature.properties.url+ '" /></a>'+'<h2>'+feature.properties.title+'</h2>' +
                                        /*feature.properties.description+*/'</div>';
                                        break;
                                        case 'TEXT':
                                        content = '<div class="map-content"><h2>'+feature.properties.title+'</h2>' +
                                        feature.properties.description+'</div>';
                                        break;
                                        case 'AUDIO':
                                        content =  '<div class="map-content"><audio style="width:280px;" controls autobuffer>'+
                                        '<source src="'+feature.properties.url+'"type=""/> <code>Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="'+
                                        feature.properties.url+'">download it</a> and watch it with your favorite video player!</code></audio>'+
                                        '<h2>'+feature.properties.title+'</h2>' +feature.properties.description+'</div>';
                                        break;
                                        case 'VIDEO':

                                        content = '<div class="map-content"><iframe width="280" height="250" src="'+feature.properties.url+'" frameborder="0" allowfullscreen></iframe>'+
                                        '<h2>'+feature.properties.title+'</h2>' +
                                        '</div>';

                                    }
                                    marker.bindPopup(content);
              

                                });

  

//center map position when user clicks on marker

myLayer.on('popupopen', function(e) {
    var px = MAP.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.popup._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    MAP.panTo(MAP.unproject(px),{animate: true}); // pan to new center
    //scroll in the sidebar to the related content
    updateSidebarView(e.layer);

});


//Load map features from api url
// TODO: add GeoJson filtered by appName to the map
// bug: unable to get the events to fire like on ready

myLayer.loadURL(Meteor.settings.public.apis.getFeatures);


//myLayer.on('ready', function(e) {
  myLayer.on('ready', function(e){ 
    overlays.clearLayers()
    
    // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
    clusterGroup = new L.featureGroup();
     // create a new MarkerClusterGroup that will show special-colored
    // numbers to indicate the category
    function makeGroup(color) {
      return new L.MarkerClusterGroup({
       
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
    groups = {
      "Built Heritage": makeGroup('#d24646'),
      "Urban Life": makeGroup('#f97352'),
      "Intangible Cultural Heritage": makeGroup('#FFEB3B'),
      "French Influence": makeGroup('#536DFE'),
      "Tamil Culture": makeGroup('#FF5722'),
      "Natural Heritage": makeGroup('#00796B'),
      "Spiritual Practice": makeGroup('#FFC107'),
      "Village Life": makeGroup('#F44336'),
      "Lived Experience": makeGroup('#F44334'),
      "Other Indian Influence": makeGroup('#F44332'),
      "Other Foreign Influence": makeGroup('#F44330')
    };
    
     
    myLayer.eachLayer(function(layer) {
      // add each feature to its specific group.
            var categoryFilter= Session.get("categoryFilter");
            var groupFilter = Session.get('groupFilter');
          
            if(groupFilter.indexOf(layer.feature.properties.groupname) !== -1){
              if (categoryFilter.indexOf(layer.feature.properties.category) !== -1) {
            
                groups[layer.feature.properties.category].addLayer(layer);
        }
        }
   
      //DEPRECATED: call update search form to update the map filter state
      
      // updateSearchForm();
       //update content in side bar, according to category filter
      // updateSideBarContent();
       
   });

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


//Deprecated code
/*
//search form in sidebar should sync with the category filter 
var updateSearchForm = function(){
        //side bar for geo json data
//TODO: needs more tweaking
    
      var heading = $('.sidebar');
     var searchForm = document.createElement('div');
     searchForm.className = 'filter-form';
     var inputField = document.createElement('input');
     var inputType = document.createAttribute("type");
     inputType.value = "text";
     inputField.setAttributeNode(inputType);
     var tagsInputAttr = document.createAttribute("data-role");
     tagsInputAttr.value ="tagsinput";
     inputField.setAttributeNode(tagsInputAttr);
     inputField.value = Session.get('categoryFilter');

     searchForm.appendChild(inputField);
     heading.append(searchForm);
     
      
       }

     
 var updateSideBarContent = function(){
        $("#listings").empty();
        overlays.eachLayer(function(layer) {

           _.each(layer.toGeoJSON().features, function(feature){
                   var listings = document.getElementById('listings');
     
                                    var listing = listings.appendChild(document.createElement('div'));
                                    listing.className = 'item';

                                    var link = listing.appendChild(document.createElement('a'));
                                    link.href = '#';
                                    link.className = 'title';
                                    link.innerHTML = '<h3>'+feature.properties.title+'</h3>';
                                    var description = listing.appendChild(document.createElement('p'));

                                    description.innerHTML = '<p>'+feature.properties.description+'</p>';
                                    /*var thumbnail = '<img class="img-responsive"'+'src='+layer.toGeoJSON().properties.url+'/>'
                                    description.appendChild(thumbnail);

                                    link.onclick = function() {
                                    // When a menu item is clicked, animate the map to center
                                    // its associated locale and open its popup.
                                    
                                     MAP.setView(layer.getLatLng(), 16);
                                     //map.panTo(marker.getLatLng());
                                     layer.openPopup();
                                }
                            });
});

}*/