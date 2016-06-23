  // testing the meteor way components will be easy to customize
       // TODO: filter function is not working && event click on item should change view in map

Template.sidebar.helpers({
  content: function(){
    
    var filters = Session.get('categoryFilter');
    var groupFilter = Session.get('groupFilter');
    filteredFeatures = _.compact(_.map(GeoJson.get('Features').features, function(item) {
      if(filters.indexOf(item.properties.category) !== -1 && groupFilter.indexOf(item.properties.groupname) !== -1){
        
        return item
      } 
    }));
    console.log(filteredFeatures, GeoJson);

    return filteredFeatures;
   
  }
  
});

Template.sidebarHeader.helpers({
   content: function(){
    
    var filters = Session.get('categoryFilter');
    var groupFilter = Session.get('groupFilter');
    filteredFeatures = _.compact(_.map(GeoJson.get('Features').features, function(item) {
     
            if(filters.indexOf(item.properties.category) !== -1 && groupFilter.indexOf(item.properties.groupname) !== -1){
                    return item;
      } 
   
    }));
    console.log(filteredFeatures, GeoJson);

    return filteredFeatures;
   
  },
  filterCategory: function(){
    return Session.get('categoryFilter');
  },
  filterCount: function(arg){
    console.log(arg.length);
        return arg.length;
    
  }
});
Template.sidebar.events({
  'click img':function(event){
    var features = GeoJson.get("Features");
    var featureId = event.target.getAttribute('for');
    myLayer.eachLayer(function(layer){
      if(layer.feature.id === featureId){
        //TODO: map zoom is too high - to make the popup to open
        //since marker is in a clustergroup
        MAP.setView(layer.getLatLng(), 20);
        //map.panTo(marker.getLatLng());
        layer.openPopup();
        
            console.log(layer.getLatLng());
          }
    });
  },
  'click .content-show-event': function(event, template){
    event.preventDefault();
      template.$('div.card-reveal[data-rel=' + event.target.getAttribute('data-rel') + ']').slideToggle('slow');
  },
  'click .card-reveal .close': function(event, template){
    event.preventDefault();
      template.$('div.card-reveal[data-rel=' + event.target.getAttribute('data-rel') + ']').slideToggle('slow');
  }

});



/* disabled: TODO: Feature incomplete
// sidebar form item for filter with TODO: type ahead
Template.filterForm.helpers({
  content: function(){
    //return Template.instance.categories;
    return Session.get('categoryFilter');
  }
});

//TODO: event handler for the input field
Template.filterForm.events({
  "change input": function(event, template){
    event.preventDefault();
    var formValue = event.target.value;
    var arrayForm = formValue.split(',').map(function(n) {return Number(n);});
    //var arrayForm = JSON.parse("["+formValue.toString()+"]");
    console.log(formValue, arrayForm, template);
  }
});


/*Template.filterForm.onCreated(function(){
  var instance = this;
    instance.categories = function(){
      return appConfig.get('appConfig').categorys.map(function(cat){
        return cat.categoryName;
      })};
  
  instance.autorun = function() {
    Session.set('categoryFilter', Template.instance().categories);
    instance.subscribe('content', instance.categories());
  }
});*/
/*Template.filterForm.onRendered(function(){
  Template.instance().$('input').tagsinput();
  this.autorun = function() {
  Template.instance().$('input').tagsinput('add', Session.get('categoryList'));
}
  //console.log(Template.instance().categories, "rendered");
});*/